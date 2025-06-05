
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
