
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Enhanced error handling for Supabase operations
export const handleSupabaseError = (error: any, context?: string) => {
  console.error(`Supabase error ${context ? `in ${context}` : ''}:`, error);
  
  const message = error?.message || 'An unexpected error occurred';
  
  // Handle specific error types
  if (error?.code === 'PGRST116') {
    toast.error('No data found');
    return;
  }
  
  if (error?.code === '23505') {
    toast.error('This record already exists');
    return;
  }
  
  if (error?.code === '42501') {
    toast.error('You do not have permission to perform this action');
    return;
  }

  toast.error(message);
};

// Safe file upload with validation
export const uploadFile = async (
  file: File,
  bucket: string,
  path: string
): Promise<string | null> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      handleSupabaseError(error, 'file upload');
      return null;
    }

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (error) {
    handleSupabaseError(error, 'file upload');
    return null;
  }
};

// Batch file upload
export const uploadFiles = async (
  files: File[],
  bucket: string,
  userId: string
): Promise<string[]> => {
  const uploadPromises = files.map(async (file, index) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}-${index}.${fileExt}`;
    return uploadFile(file, bucket, fileName);
  });

  const results = await Promise.all(uploadPromises);
  return results.filter((url): url is string => url !== null);
};

// Check storage bucket accessibility
export const checkStorageHealth = async (bucket: string): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .list('', { limit: 1 });
    
    return !error;
  } catch {
    return false;
  }
};
