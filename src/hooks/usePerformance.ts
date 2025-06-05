
import { useEffect, useRef } from 'react';
import { performanceMonitor } from '@/utils/performance';

export const usePerformance = (componentName: string) => {
  const renderStartTime = useRef<number>();

  useEffect(() => {
    renderStartTime.current = performance.now();
    
    return () => {
      if (renderStartTime.current) {
        const renderTime = performance.now() - renderStartTime.current;
        performanceMonitor.recordMetric(`component_render_${componentName}`, renderTime);
      }
    };
  }, [componentName]);

  const measureOperation = (operationName: string) => {
    return performanceMonitor.startTimer(`${componentName}_${operationName}`);
  };

  return { measureOperation };
};
