
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from './logger';
import { API_CONFIG } from './environment';

// Enhanced error handling for Supabase operations
export const handleSupabaseError = (error: any, context?: string) => {
  const errorMessage = error?.message || 'An unexpected error occurred';
  
  logger.error(`Supabase error ${context ? `in ${context}` : ''}`, {
    error: errorMessage,
    code: error?.code,
    details: error?.details,
    hint: error?.hint,
    context,
  });
  
  // Handle specific error types with user-friendly messages
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

  if (error?.code === 'PGRST301') {
    toast.error('Access denied. Please check your permissions.');
    return;
  }

  // Network-related errors
  if (error?.message?.includes('Failed to fetch') || error?.message?.includes('NetworkError')) {
    toast.error('Network connection issue. Please check your internet connection.');
    return;
  }

  // Rate limiting
  if (error?.status === 429) {
    toast.error('Too many requests. Please wait a moment and try again.');
    return;
  }

  // Generic error with sanitized message
  toast.error(errorMessage);
};

// Safe file upload with validation and progress tracking
export const uploadFile = async (
  file: File,
  bucket: string,
  path: string,
  onProgress?: (progress: number) => void
): Promise<string | null> => {
  try {
    // Validate file size
    if (file.size > API_CONFIG.maxFileSize) {
      throw new Error(`File size exceeds ${API_CONFIG.maxFileSize / (1024 * 1024)}MB limit`);
    }

    logger.info('Starting file upload', {
      fileName: file.name,
      fileSize: file.size,
      bucket,
      path,
    });

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      handleSupabaseError(error, 'file upload');
      return null;
    }

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    logger.info('File upload successful', {
      path: data.path,
      publicUrl: urlData.publicUrl,
    });

    return urlData.publicUrl;
  } catch (error) {
    handleSupabaseError(error, 'file upload');
    return null;
  }
};

// Batch file upload with parallel processing
export const uploadFiles = async (
  files: File[],
  bucket: string,
  userId: string,
  onProgress?: (completed: number, total: number) => void
): Promise<string[]> => {
  logger.info('Starting batch file upload', {
    fileCount: files.length,
    bucket,
    userId,
  });

  const uploadPromises = files.map(async (file, index) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}-${index}.${fileExt}`;
    
    const result = await uploadFile(file, bucket, fileName);
    
    // Report progress
    if (onProgress) {
      onProgress(index + 1, files.length);
    }
    
    return result;
  });

  const results = await Promise.all(uploadPromises);
  const successfulUploads = results.filter((url): url is string => url !== null);
  
  logger.info('Batch file upload completed', {
    attempted: files.length,
    successful: successfulUploads.length,
    failed: files.length - successfulUploads.length,
  });

  return successfulUploads;
};

// Check storage bucket accessibility with retry logic
export const checkStorageHealth = async (bucket: string): Promise<boolean> => {
  let retries = 0;
  const maxRetries = API_CONFIG.retryAttempts;
  
  while (retries < maxRetries) {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .list('', { limit: 1 });
      
      if (!error) {
        logger.info('Storage health check passed', { bucket });
        return true;
      }
      
      logger.warn('Storage health check failed', { bucket, error: error.message, attempt: retries + 1 });
      retries++;
      
      // Wait before retry (exponential backoff)
      if (retries < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries)));
      }
    } catch (error) {
      logger.error('Storage health check error', { bucket, error, attempt: retries + 1 });
      retries++;
      
      if (retries < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries)));
      }
    }
  }
  
  logger.error('Storage health check failed after all retries', { bucket, maxRetries });
  return false;
};

// Database health check
export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    if (!error) {
      logger.info('Database health check passed');
      return true;
    }
    
    logger.warn('Database health check failed', { error: error.message });
    return false;
  } catch (error) {
    logger.error('Database health check error', { error });
    return false;
  }
};

// Comprehensive system health check
export const performHealthCheck = async () => {
  const checks = {
    database: await checkDatabaseHealth(),
    storage: await checkStorageHealth('complaints-media'),
  };
  
  const isHealthy = Object.values(checks).every(Boolean);
  
  logger.info('System health check completed', {
    isHealthy,
    checks,
  });
  
  return {
    isHealthy,
    checks,
    timestamp: new Date().toISOString(),
  };
};
