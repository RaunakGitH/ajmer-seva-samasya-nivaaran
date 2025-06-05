
// Environment configuration utilities
export const ENV = {
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  isTest: import.meta.env.MODE === 'test',
} as const;

export const API_CONFIG = {
  timeout: ENV.isProduction ? 30000 : 10000, // 30s in prod, 10s in dev
  retryAttempts: ENV.isProduction ? 3 : 1,
  maxFileSize: 5 * 1024 * 1024, // 5MB
  baseUrl: ENV.isProduction 
    ? 'https://gxxsjvhknmcykgvinhno.supabase.co' 
    : 'https://gxxsjvhknmcykgvinhno.supabase.co'
} as const;

// Performance monitoring
export const PERFORMANCE_CONFIG = {
  enableMetrics: ENV.isProduction,
  sampleRate: ENV.isProduction ? 0.1 : 1.0, // 10% sampling in production
} as const;

// Logging configuration
export const LOG_CONFIG = {
  level: ENV.isProduction ? 'error' : 'debug',
  enableConsole: !ENV.isProduction,
  enableRemote: ENV.isProduction,
} as const;

// App URLs
export const APP_CONFIG = {
  siteUrl: ENV.isProduction 
    ? 'https://your-app-name.vercel.app' // Update this with your actual Vercel domain
    : 'http://localhost:8080',
  supabaseUrl: 'https://gxxsjvhknmcykgvinhno.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4eHNqdmhrbm1jeWtndmluaG5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNDc0ODYsImV4cCI6MjA2MDgyMzQ4Nn0.3NjrgBC5JdA3eA5QCki6nQaUxJmmhdPSMe_xQ820z1g'
} as const;
