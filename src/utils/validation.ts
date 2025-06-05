
import { z } from 'zod';

// Complaint validation schemas
export const complaintSchema = z.object({
  title: z.string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be less than 100 characters')
    .trim(),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters')
    .trim(),
  category: z.string()
    .min(1, 'Category is required'),
  location_lat: z.number()
    .min(-90, 'Invalid latitude')
    .max(90, 'Invalid latitude')
    .optional(),
  location_lng: z.number()
    .min(-180, 'Invalid longitude')
    .max(180, 'Invalid longitude')
    .optional(),
});

// User profile validation
export const profileSchema = z.object({
  full_name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .trim()
    .optional(),
  phone: z.string()
    .regex(/^\+?[\d\s-()]+$/, 'Invalid phone number format')
    .optional(),
  email: z.string()
    .email('Invalid email address')
    .optional(),
});

// File validation
export const fileValidation = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  maxFiles: 5,
};

export const validateFile = (file: File): string | null => {
  if (file.size > fileValidation.maxSize) {
    return `File size must be less than ${fileValidation.maxSize / (1024 * 1024)}MB`;
  }
  
  if (!fileValidation.allowedTypes.includes(file.type)) {
    return 'File type not supported. Please use JPEG, PNG, WebP, or PDF files.';
  }
  
  return null;
};

export const validateFiles = (files: File[]): string | null => {
  if (files.length > fileValidation.maxFiles) {
    return `Maximum ${fileValidation.maxFiles} files allowed`;
  }
  
  for (const file of files) {
    const error = validateFile(file);
    if (error) return error;
  }
  
  return null;
};

// Sanitize input to prevent XSS
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .trim();
};
