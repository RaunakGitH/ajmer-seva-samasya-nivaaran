
import { logger } from './logger';
import { ENV } from './environment';

interface ErrorInfo {
  message: string;
  stack?: string;
  componentStack?: string;
  url?: string;
  userAgent?: string;
  userId?: string;
}

class ErrorTracker {
  private errorQueue: ErrorInfo[] = [];
  private maxQueueSize = 50;

  constructor() {
    // Set up global error handlers
    this.setupGlobalErrorHandlers();
  }

  private setupGlobalErrorHandlers() {
    // Handle unhandled JavaScript errors
    window.addEventListener('error', (event) => {
      this.trackError({
        message: event.message,
        stack: event.error?.stack,
        url: event.filename,
        userAgent: navigator.userAgent,
      });
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        url: window.location.href,
        userAgent: navigator.userAgent,
      });
    });
  }

  trackError(errorInfo: ErrorInfo) {
    // Add timestamp
    const enrichedError = {
      ...errorInfo,
      timestamp: new Date().toISOString(),
      url: errorInfo.url || window.location.href,
    };

    // Log the error
    logger.error('Error tracked', enrichedError);

    // Add to queue
    this.errorQueue.push(enrichedError);
    
    // Maintain queue size
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift();
    }

    // In production, send to error tracking service
    if (ENV.isProduction) {
      this.sendToErrorService(enrichedError);
    }
  }

  private sendToErrorService(errorInfo: ErrorInfo) {
    // Placeholder for error tracking service integration
    // Could integrate with Sentry, Bugsnag, etc.
    console.log('Would send to error tracking service:', errorInfo);
  }

  getErrorQueue(): ErrorInfo[] {
    return [...this.errorQueue];
  }

  clearErrorQueue() {
    this.errorQueue = [];
  }
}

export const errorTracker = new ErrorTracker();
