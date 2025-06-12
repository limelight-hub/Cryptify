import { useState, useCallback, useRef } from 'react';

interface PerformanceMetric {
  operation: string;
  method: string;
  inputLength: number;
  outputLength: number;
  duration: number;
  timestamp: Date;
  success: boolean;
}

interface PerformanceStats {
  totalOperations: number;
  successfulOperations: number;
  averageDuration: number;
  totalInputChars: number;
  totalOutputChars: number;
  lastOperation?: PerformanceMetric;
}

export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const startTimeRef = useRef<number>(0);

  const startTimer = useCallback(() => {
    startTimeRef.current = performance.now();
  }, []);

  const recordMetric = useCallback((
    operation: string,
    method: string,
    inputLength: number,
    outputLength: number,
    success: boolean = true
  ) => {
    const duration = performance.now() - startTimeRef.current;

    const metric: PerformanceMetric = {
      operation,
      method,
      inputLength,
      outputLength,
      duration,
      timestamp: new Date(),
      success,
    };

    setMetrics(prev => [...prev.slice(-99), metric]); // Keep last 100 metrics

    return metric;
  }, []);

  const getStats = useCallback((): PerformanceStats => {
    if (metrics.length === 0) {
      return {
        totalOperations: 0,
        successfulOperations: 0,
        averageDuration: 0,
        totalInputChars: 0,
        totalOutputChars: 0,
      };
    }

    const successfulMetrics = metrics.filter(m => m.success);
    const totalDuration = successfulMetrics.reduce((sum, m) => sum + m.duration, 0);

    return {
      totalOperations: metrics.length,
      successfulOperations: successfulMetrics.length,
      averageDuration: totalDuration / successfulMetrics.length,
      totalInputChars: metrics.reduce((sum, m) => sum + m.inputLength, 0),
      totalOutputChars: metrics.reduce((sum, m) => sum + m.outputLength, 0),
      lastOperation: metrics[metrics.length - 1],
    };
  }, [metrics]);

  const clearMetrics = useCallback(() => {
    setMetrics([]);
  }, []);

  const getMethodStats = useCallback((method: string) => {
    const methodMetrics = metrics.filter(m => m.method === method && m.success);
    if (methodMetrics.length === 0) return null;

    const totalDuration = methodMetrics.reduce((sum, m) => sum + m.duration, 0);
    return {
      operations: methodMetrics.length,
      averageDuration: totalDuration / methodMetrics.length,
      totalChars: methodMetrics.reduce((sum, m) => sum + m.inputLength, 0),
    };
  }, [metrics]);

  return {
    startTimer,
    recordMetric,
    getStats,
    getMethodStats,
    clearMetrics,
    metrics,
  };
};
