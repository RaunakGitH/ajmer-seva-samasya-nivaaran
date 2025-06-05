
import { LOG_CONFIG } from './environment';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
    };
    
    const configLevel = levels[LOG_CONFIG.level as LogLevel] || 0;
    return levels[level] >= configLevel;
  }

  private formatMessage(level: LogLevel, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const baseMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    
    if (data) {
      return `${baseMessage} ${JSON.stringify(data)}`;
    }
    
    return baseMessage;
  }

  debug(message: string, data?: any) {
    if (!this.shouldLog('debug')) return;
    
    if (LOG_CONFIG.enableConsole) {
      console.debug(this.formatMessage('debug', message, data));
    }
  }

  info(message: string, data?: any) {
    if (!this.shouldLog('info')) return;
    
    if (LOG_CONFIG.enableConsole) {
      console.info(this.formatMessage('info', message, data));
    }
  }

  warn(message: string, data?: any) {
    if (!this.shouldLog('warn')) return;
    
    if (LOG_CONFIG.enableConsole) {
      console.warn(this.formatMessage('warn', message, data));
    }
  }

  error(message: string, error?: any) {
    if (!this.shouldLog('error')) return;
    
    const errorData = error instanceof Error ? {
      message: error.message,
      stack: error.stack,
      name: error.name,
    } : error;
    
    if (LOG_CONFIG.enableConsole) {
      console.error(this.formatMessage('error', message, errorData));
    }
    
    // In production, you could send errors to monitoring service here
    if (LOG_CONFIG.enableRemote) {
      this.sendToRemoteLogging(message, errorData);
    }
  }

  private sendToRemoteLogging(message: string, data?: any) {
    // Placeholder for remote logging service integration
    // Could integrate with services like Sentry, LogRocket, etc.
    console.log('Would send to remote logging:', { message, data });
  }
}

export const logger = new Logger();
