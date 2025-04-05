
import axios from 'axios';
import { toast } from 'sonner';
import { checkApiKey } from './config';
import { 
  getCacheKey, 
  getLocalCache, 
  setLocalCache, 
  CACHE_TTL,
  updateApiUsageStats
} from './cache';
import { throttledRequest, REQUEST_PRIORITY } from './throttle';

// Initialize Axios instance with default configuration
export const api = axios.create({
  baseURL: 'https://api.polygon.io', 
  timeout: 15000, // Increased timeout for reliability
});

// Network status detection
let isOnline = navigator.onLine;
window.addEventListener('online', () => {
  isOnline = true;
  toast.success('Back online. Refreshing data...');
});
window.addEventListener('offline', () => {
  isOnline = false;
  toast.warning('You are offline. Using cached data.');
});

// Enhanced API request wrapper with caching, throttling and error handling
export const makeRequest = async <T>(
  url: string, 
  params: Record<string, any> = {},
  options: {
    cacheTTL?: number;
    forceRefresh?: boolean;
    priority?: number;
    tag?: string;
  } = {}
): Promise<T> => {
  // Determine appropriate cache TTL based on URL pattern
  let cacheTTL = options.cacheTTL;
  if (!cacheTTL) {
    if (url.includes('marketstatus')) {
      cacheTTL = CACHE_TTL.MARKET_STATUS;
    } else if (url.includes('snapshot') && url.includes('tickers')) {
      cacheTTL = CACHE_TTL.MARKET_INDICES;
    } else if (url.includes('aggs')) {
      cacheTTL = CACHE_TTL.AGGREGATE_DATA;
    } else {
      cacheTTL = CACHE_TTL.MARKET_INDICES; // Default
    }
  }
  
  // Generate cache key
  const cacheKey = getCacheKey(url, params);
  
  // Check cache first if not forcing refresh
  if (!options.forceRefresh) {
    const cachedData = getLocalCache<T>(cacheKey);
    if (cachedData) {
      console.log('Using cached data for:', url);
      return cachedData.data;
    }
  }
  
  // If we're offline and don't have cache, reject
  if (!isOnline) {
    toast.error('You are offline and requested data is not cached');
    return Promise.reject(new Error('Offline and data not cached'));
  }
  
  // Wrap the actual request in a throttler
  return throttledRequest(async () => {
    try {
      const apiKey = checkApiKey();
      
      // Debug logs to see what's being sent
      console.log('API Request:', {
        url,
        params: { ...params, apiKey: '****' }
      });

      // Make the request with apiKey properly formatted in the query parameters
      const response = await api.get<T>(url, {
        params: {
          ...params,
          apiKey,
        },
      });

      console.log('API Response Status:', response.status);
      
      // Update API usage statistics
      updateApiUsageStats(url);
      
      // Cache successful responses
      if (response.status === 200 && response.data) {
        setLocalCache(cacheKey, response.data, cacheTTL);
      }
      
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      
      if (axios.isAxiosError(error)) {
        console.error('Axios Error Details:', {
          status: error.response?.status,
          data: error.response?.data,
          config: error.config
        });

        if (error.response?.status === 401 || error.response?.status === 403) {
          toast.error('API Key Error: Your API key is invalid or has expired.');
        } else if (error.response?.status === 429) {
          toast.error('Rate limit exceeded. Please try again later.');
        } else {
          toast.error(`API Error: ${error.message}. Check console for details.`);
        }
        
        // Try to return cached data as fallback even if it's expired
        const cachedData = getLocalCache<T>(cacheKey, true);
        if (cachedData) {
          toast.info('Using stale cached data as fallback');
          return cachedData.data;
        }
      } else {
        toast.error('Unexpected error during API request.');
      }
      throw error;
    }
  }, options.priority || REQUEST_PRIORITY.MEDIUM);
};

// Batch multiple requests into a single request where possible
export const batchRequests = async <T>(
  requests: Array<{ url: string; params: Record<string, any> }>,
  options: {
    cacheTTL?: number;
    forceRefresh?: boolean;
    priority?: number;
  } = {}
): Promise<T[]> => {
  // For now, just execute them in sequence through the throttler
  // In future, this could be enhanced to use the Polygon batch API if available
  const results: T[] = [];
  
  for (const request of requests) {
    try {
      const result = await makeRequest<T>(
        request.url,
        request.params,
        options
      );
      results.push(result);
    } catch (error) {
      console.error('Error in batched request:', error);
      results.push(null as unknown as T);
    }
  }
  
  return results;
};

// Function to prefetch data that will likely be needed soon
export const prefetchData = <T>(
  url: string,
  params: Record<string, any> = {},
  options: {
    cacheTTL?: number;
  } = {}
): void => {
  makeRequest<T>(url, params, { 
    ...options,
    priority: REQUEST_PRIORITY.LOW,
    forceRefresh: false
  })
    .catch(error => {
      // Silently fail for prefetch requests
      console.log('Prefetch failed:', error);
    });
};
