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
import { throttledRequest } from './throttle';

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

// Simplified API request wrapper optimized for unlimited API calls
export const makeRequest = async <T>(
  url: string, 
  params: Record<string, any> = {},
  options: {
    cacheTTL?: number;
    forceRefresh?: boolean;
  } = {}
): Promise<T> => {
  const cacheKey = getCacheKey(url, params);
  
  // Still check cache first if not forcing refresh and if we're offline
  if (!options.forceRefresh || !isOnline) {
    const cachedData = getLocalCache<T>(cacheKey);
    if (cachedData) {
      return cachedData.data;
    }
  }
  
  // If we're offline and don't have cache, reject
  if (!isOnline) {
    toast.error('You are offline and requested data is not cached');
    return Promise.reject(new Error('Offline and data not cached'));
  }
  
  // With unlimited API calls, we don't need complex throttling
  return throttledRequest(async () => {
    try {
      const apiKey = checkApiKey();
      
      // Make the request with apiKey properly formatted in the query parameters
      const response = await api.get<T>(url, {
        params: {
          ...params,
          apiKey,
        },
      });
      
      // Update API usage statistics (keeping this for monitoring purposes)
      updateApiUsageStats(url);
      
      // Still cache responses for offline support
      if (response.status === 200 && response.data) {
        const cacheTTL = options.cacheTTL || CACHE_TTL.MARKET_INDICES;
        setLocalCache(cacheKey, response.data, cacheTTL);
      }
      
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          toast.error('API Key Error: Your API key is invalid or has expired.');
        } else {
          toast.error(`API Error: ${error.message}. Check console for details.`);
        }
        
        // Try to return cached data as fallback
        const cachedData = getLocalCache<T>(cacheKey);
        if (cachedData) {
          toast.info('Using cached data as fallback');
          return cachedData.data;
        }
      } else {
        toast.error('Unexpected error during API request.');
      }
      throw error;
    }
  });
};

// Optimized batch request function for unlimited API calls
export const batchRequests = async <T>(
  requests: Array<{ url: string; params: Record<string, any> }>,
  options: {
    cacheTTL?: number;
    forceRefresh?: boolean;
  } = {}
): Promise<T[]> => {
  // With unlimited API calls, we can make parallel requests
  return Promise.all(
    requests.map(request => 
      makeRequest<T>(request.url, request.params, options)
    )
  );
};

// Function to prefetch data that will likely be needed soon
export const prefetchData = <T>(
  url: string,
  params: Record<string, any> = {},
  options: {
    cacheTTL?: number;
  } = {}
): void => {
  makeRequest<T>(url, params, options)
    .catch(error => {
      // Silently fail for prefetch requests
      console.log('Prefetch failed:', error);
    });
};
