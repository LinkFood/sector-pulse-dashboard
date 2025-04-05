
// A simplified request management system optimized for unlimited API calls

export const REQUEST_PRIORITY = {
  HIGH: 10,    // For user-initiated actions that need immediate response
  MEDIUM: 5,   // For visible data that affects UI
  LOW: 1,      // For background prefetching, non-visible data
};

// Given unlimited API calls, we can simplify our throttler
class RequestManager {
  // Just maintain a simple logging mechanism to track API usage
  private requestCount: number = 0;
  
  public async add<T>(fn: () => Promise<T>): Promise<T> {
    this.requestCount++;
    
    // For debugging purposes
    if (this.requestCount % 100 === 0) {
      console.log(`API Request count: ${this.requestCount}`);
    }
    
    // With unlimited API calls, we just execute the request directly
    return fn();
  }

  public getRequestCount(): number {
    return this.requestCount;
  }

  // Reset count (for debugging/monitoring)
  public resetCount(): void {
    this.requestCount = 0;
  }
}

// Create and export a singleton manager
export const apiThrottler = new RequestManager();

// Simplified request function that just passes through
export const throttledRequest = async <T>(
  fn: () => Promise<T>
): Promise<T> => {
  return apiThrottler.add(fn);
};
