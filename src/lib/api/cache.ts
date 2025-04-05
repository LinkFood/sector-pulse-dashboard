import { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Define cache TTL (Time To Live) in milliseconds for different data types
export const CACHE_TTL = {
  MARKET_STATUS: 5 * 60 * 1000, // 5 minutes
  MARKET_INDICES: 2 * 60 * 1000, // 2 minutes
  SECTOR_PERFORMANCE: 15 * 60 * 1000, // 15 minutes
  WATCHLIST: 1 * 60 * 1000, // 1 minute
  AGGREGATE_DATA: 10 * 60 * 1000, // 10 minutes
  TECHNICAL_DATA: 30 * 60 * 1000, // 30 minutes
  SCREENER_RESULTS: 60 * 60 * 1000, // 60 minutes
  MARKET_BREADTH: 20 * 60 * 1000, // 20 minutes
};

// LocalStorage keys
export const STORAGE_KEYS = {
  API_CACHE_PREFIX: 'polygon_api_cache_',
  API_LAST_UPDATED_PREFIX: 'polygon_api_last_updated_',
  API_USAGE_STATS: 'polygon_api_usage_stats',
};

// Interface for API cache entry
export interface ApiCacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

// Interface for API usage statistics
export interface ApiUsageStats {
  dailyRequests: number;
  lastResetDate: string;
  requestsByEndpoint: Record<string, number>;
}

// Get the daily reset date as a string
const getDailyResetDate = (): string => {
  const date = new Date();
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

// Initialize or get API usage statistics
export const getApiUsageStats = (): ApiUsageStats => {
  const storedStats = localStorage.getItem(STORAGE_KEYS.API_USAGE_STATS);
  const defaultStats: ApiUsageStats = {
    dailyRequests: 0,
    lastResetDate: getDailyResetDate(),
    requestsByEndpoint: {},
  };

  if (!storedStats) {
    return defaultStats;
  }

  const stats: ApiUsageStats = JSON.parse(storedStats);
  
  // Reset if it's a new day
  const today = getDailyResetDate();
  if (stats.lastResetDate !== today) {
    stats.dailyRequests = 0;
    stats.lastResetDate = today;
    stats.requestsByEndpoint = {};
  }
  
  return stats;
};

// Update API usage statistics
export const updateApiUsageStats = (endpoint: string): void => {
  const stats = getApiUsageStats();
  stats.dailyRequests += 1;
  
  if (!stats.requestsByEndpoint[endpoint]) {
    stats.requestsByEndpoint[endpoint] = 0;
  }
  stats.requestsByEndpoint[endpoint] += 1;
  
  localStorage.setItem(STORAGE_KEYS.API_USAGE_STATS, JSON.stringify(stats));
  
  // Warn if approaching rate limits
  if (stats.dailyRequests >= 80) {
    toast.warning(`API usage: ${stats.dailyRequests}/100 daily requests used`);
  }
};

// Get cache key based on URL and params
export const getCacheKey = (url: string, params: Record<string, any> = {}): string => {
  const sortedParams = Object.entries(params)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .filter(([_, value]) => value !== undefined);
  
  const paramsString = sortedParams.length > 0 
    ? `?${sortedParams.map(([key, value]) => `${key}=${value}`).join('&')}` 
    : '';
  
  return `${url}${paramsString}`;
};

// Set data in localStorage cache
export const setLocalCache = <T>(key: string, data: T, ttl: number): void => {
  try {
    const cacheKey = `${STORAGE_KEYS.API_CACHE_PREFIX}${key}`;
    const entry: ApiCacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
    };
    
    const serialized = JSON.stringify(entry);
    // Check if we're approaching storage limits
    if (serialized.length > 5 * 1024 * 1024) {
      console.warn('Cache entry is very large, might exceed localStorage limits');
    }
    
    localStorage.setItem(cacheKey, serialized);
    localStorage.setItem(`${STORAGE_KEYS.API_LAST_UPDATED_PREFIX}${key}`, Date.now().toString());
  } catch (error) {
    console.error('Cache storage error:', error);
    // If it's a quota error, try clearing older caches
    try {
      clearOldCache();
    } catch (e) {
      console.error('Failed to clear cache:', e);
    }
  }
};

// Get data from localStorage cache
export const getLocalCache = <T>(key: string): ApiCacheEntry<T> | null => {
  try {
    const cacheKey = `${STORAGE_KEYS.API_CACHE_PREFIX}${key}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (!cached) return null;
    
    const entry: ApiCacheEntry<T> = JSON.parse(cached);
    const now = Date.now();
    
    // Always return the cache entry, even if expired
    // This allows fallback to stale data when needed
    return entry;
  } catch (error) {
    console.error('Cache retrieval error:', error);
    return null;
  }
};

// Clear all cache items
export const clearCache = (): void => {
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith(STORAGE_KEYS.API_CACHE_PREFIX)) {
      localStorage.removeItem(key);
    }
  });
  
  toast.success('API cache cleared');
};

// Clear old cache entries to save space
export const clearOldCache = (): void => {
  const now = Date.now();
  let clearedCount = 0;
  
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith(STORAGE_KEYS.API_CACHE_PREFIX)) {
      try {
        const cached = localStorage.getItem(key);
        if (cached) {
          const entry = JSON.parse(cached) as ApiCacheEntry<any>;
          if (now - entry.timestamp > entry.ttl * 2) {
            localStorage.removeItem(key);
            clearedCount++;
          }
        }
      } catch (e) {
        // If we can't parse the entry, remove it
        localStorage.removeItem(key);
        clearedCount++;
      }
    }
  });
  
  console.log(`Cleared ${clearedCount} old cache entries`);
};

// Initialize React Query client with optimized settings
export const createOptimizedQueryClient = (): QueryClient => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: CACHE_TTL.MARKET_INDICES, // Default stale time
        refetchOnWindowFocus: false, // Avoid unnecessary refetches
        retry: 1, // Only retry once
        networkMode: 'offlineFirst', // Work offline when possible
        gcTime: 1000 * 60 * 60 * 12, // Keep unused queries in memory for 12 hours
      },
    },
  });
};
