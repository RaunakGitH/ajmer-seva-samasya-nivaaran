
import { PERFORMANCE_CONFIG } from './environment';
import { logger } from './logger';

class PerformanceMonitor {
  private metrics: Map<string, number> = new Map();

  startTimer(label: string): () => void {
    if (!PERFORMANCE_CONFIG.enableMetrics) {
      return () => {};
    }

    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      this.recordMetric(label, duration);
    };
  }

  recordMetric(label: string, value: number) {
    if (!PERFORMANCE_CONFIG.enableMetrics) return;
    
    this.metrics.set(label, value);
    
    // Log performance metrics
    if (value > 1000) { // Log slow operations (>1s)
      logger.warn(`Slow operation detected: ${label}`, { duration: value });
    }
  }

  measurePageLoad() {
    if (!PERFORMANCE_CONFIG.enableMetrics) return;

    // Measure page load performance
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        const metrics = {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          totalPageLoad: navigation.loadEventEnd - navigation.fetchStart,
        };
        
        Object.entries(metrics).forEach(([key, value]) => {
          this.recordMetric(`page_${key}`, value);
        });
        
        logger.info('Page load metrics collected', metrics);
      }
    });
  }

  getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Initialize page load monitoring
performanceMonitor.measurePageLoad();
