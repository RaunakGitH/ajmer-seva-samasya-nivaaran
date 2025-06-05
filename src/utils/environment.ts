// src/utils/environment.ts

// Runtime environment flags
export const ENV = {
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  isTest: import.meta.env.MODE === 'test',
} as const;

// Supabase and API configuration
export const APP_CONFIG = {
  siteUrl: ENV.isProduction
    ? 'https://ajmer-seva-samasya-nivaaran.vercel.app'
    : 'http://localhost:3000',
  supabaseUrl: import.meta.env.PUBLIC_SUPABASE_URL,
  supabaseAnonKey: import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
} as const;

// API-specific configuration
export const API_CONFIG = {
  timeout: ENV.isProduction ? 30000 : 10000, // 30s in prod, 10s in dev
  retryAttempts: ENV.isProduction ? 3 : 1,
  maxFileSize: 5 * 1024 * 1024, // 5MB
  baseUrl: APP_CONFIG.supabaseUrl, // Supabase base URL reused
} as const;

// Optional: performance monitoring setup
export const PERFORMANCE_CONFIG = {
  enableMetrics: ENV.isProduction,
  sampleRate: ENV.isProduction ? 0.1 : 1.0, // 10% sampling in prod
} as const;

// Logging configuration
export const LOG_CONFIG = {
  level: ENV.isProduction ? 'error' : 'debug',
  enableConsole: !ENV.isProduction,
  enableRemote: ENV.isProduction,
} as const;
