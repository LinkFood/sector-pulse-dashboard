
// A simple request throttling mechanism

interface ThrottleQueueItem {
  execute: () => Promise<any>;
  resolve: (value: any) => void;
  reject: (error: Error) => void;
  priority: number;
}

class RequestThrottler {
  private queue: ThrottleQueueItem[] = [];
  private processing: boolean = false;
  private requestTimeout: number = 100; // ms between requests
  private maxConcurrent: number = 1;
  private activeRequests: number = 0;
  private paused: boolean = false;

  constructor(options?: { timeout?: number; maxConcurrent?: number }) {
    this.requestTimeout = options?.timeout ?? 100;
    this.maxConcurrent = options?.maxConcurrent ?? 1;
  }

  public async add<T>(fn: () => Promise<T>, priority: number = 1): Promise<T> {
    return new Promise((resolve, reject) => {
      const item: ThrottleQueueItem = {
        execute: fn,
        resolve,
        reject,
        priority
      };
      
      this.queue.push(item);
      // Sort by priority (higher numbers = higher priority)
      this.queue.sort((a, b) => b.priority - a.priority);
      
      this.processQueue();
    });
  }

  public pause(): void {
    this.paused = true;
  }

  public resume(): void {
    this.paused = false;
    this.processQueue();
  }

  public clear(): void {
    const queuedItems = this.queue;
    this.queue = [];
    
    // Reject all queued items
    queuedItems.forEach(item => {
      item.reject(new Error('Queue was cleared'));
    });
  }

  public getQueueLength(): number {
    return this.queue.length;
  }

  private processQueue(): void {
    if (this.processing || this.queue.length === 0 || this.paused) {
      return;
    }
    
    if (this.activeRequests >= this.maxConcurrent) {
      return;
    }
    
    this.processing = true;
    
    const processNextItem = () => {
      if (this.queue.length === 0 || this.paused || this.activeRequests >= this.maxConcurrent) {
        this.processing = false;
        return;
      }
      
      const item = this.queue.shift();
      if (!item) {
        this.processing = false;
        return;
      }
      
      this.activeRequests++;
      
      setTimeout(() => {
        item.execute()
          .then(result => item.resolve(result))
          .catch(error => item.reject(error))
          .finally(() => {
            this.activeRequests--;
            processNextItem();
          });
      }, this.requestTimeout);
    };
    
    processNextItem();
  }
}

// Create and export a singleton throttler
export const apiThrottler = new RequestThrottler({ 
  timeout: 200, // 200ms between requests
  maxConcurrent: 1 // Only 1 concurrent request
});

// Higher priority values for critical data
export const REQUEST_PRIORITY = {
  HIGH: 10,    // For user-initiated actions that need immediate response
  MEDIUM: 5,   // For visible data that affects UI but isn't critical
  LOW: 1,      // For background prefetching, non-visible data
};

// Convenience function to wrap a request with the throttler
export const throttledRequest = async <T>(
  fn: () => Promise<T>, 
  priority: number = REQUEST_PRIORITY.MEDIUM
): Promise<T> => {
  return apiThrottler.add(fn, priority);
};
