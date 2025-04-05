
import { useQuery, useMutation, useQueryClient, QueryKey } from '@tanstack/react-query';
import { makeRequest, prefetchData, batchRequests } from '@/lib/api/client';
import { useState, useEffect } from 'react';
import { CACHE_TTL } from '@/lib/api/cache';
import { REQUEST_PRIORITY } from '@/lib/api/throttle';

// Hook for fetching data with caching, offline support, and react-query integration
export function useApiData<T>(
  queryKey: QueryKey,
  url: string,
  params: Record<string, any> = {},
  options: {
    enabled?: boolean;
    cacheTTL?: number;
    refetchInterval?: number | false;
    staleTime?: number;
    retry?: boolean | number;
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
    select?: (data: T) => any;
  } = {}
) {
  // Determine appropriate cache TTL based on the URL and query key
  const cacheTTL = options.cacheTTL || getCacheTTLForEndpoint(url, queryKey);

  // Get stale time from options or use cacheTTL
  const staleTime = options.staleTime !== undefined ? options.staleTime : cacheTTL;

  return useQuery({
    queryKey,
    queryFn: async () => {
      return makeRequest<T>(url, params, {
        cacheTTL,
        priority: REQUEST_PRIORITY.MEDIUM
      });
    },
    staleTime,
    retry: options.retry !== undefined ? options.retry : 1,
    enabled: options.enabled !== undefined ? options.enabled : true,
    refetchInterval: options.refetchInterval,
    onSuccess: options.onSuccess,
    onError: options.onError,
    select: options.select,
  });
}

// Hook for prefetching data that will likely be needed soon
export function usePrefetch<T>(url: string, params: Record<string, any> = {}, queryKey: QueryKey) {
  const queryClient = useQueryClient();
  const cacheTTL = getCacheTTLForEndpoint(url, queryKey);

  const triggerPrefetch = () => {
    // First check if we already have this data in the query cache
    if (!queryClient.getQueryData(queryKey)) {
      prefetchData<T>(url, params, { cacheTTL });
    }
  };

  return { triggerPrefetch };
}

// Hook for batched requests
export function useBatchedQuery<T>(
  queryKey: QueryKey,
  requests: Array<{ url: string; params: Record<string, any> }>,
  options: {
    enabled?: boolean;
    cacheTTL?: number;
    refetchInterval?: number | false;
    retry?: boolean | number;
  } = {}
) {
  const cacheTTL = options.cacheTTL || CACHE_TTL.MARKET_INDICES;

  return useQuery({
    queryKey,
    queryFn: async () => {
      return batchRequests<T>(requests, { 
        cacheTTL,
        priority: REQUEST_PRIORITY.MEDIUM
      });
    },
    staleTime: cacheTTL,
    retry: options.retry !== undefined ? options.retry : 1,
    enabled: options.enabled !== undefined ? options.enabled : true,
    refetchInterval: options.refetchInterval,
  });
}

// Hook to track API usage statistics
export function useApiUsage() {
  const [usageStats, setUsageStats] = useState({
    dailyRequests: 0,
    requestsByEndpoint: {} as Record<string, number>,
    lastResetDate: '',
  });

  // Refresh usage stats from localStorage
  useEffect(() => {
    const getStats = () => {
      try {
        const storedStats = localStorage.getItem('polygon_api_usage_stats');
        if (storedStats) {
          setUsageStats(JSON.parse(storedStats));
        }
      } catch (e) {
        console.error('Error reading API stats:', e);
      }
    };

    // Get stats on mount
    getStats();

    // Set up interval to refresh stats
    const intervalId = setInterval(getStats, 60000);

    return () => clearInterval(intervalId);
  }, []);

  // Clear the usage history
  const resetUsageStats = () => {
    const resetStats = {
      dailyRequests: 0,
      requestsByEndpoint: {},
      lastResetDate: new Date().toISOString().split('T')[0],
    };
    localStorage.setItem('polygon_api_usage_stats', JSON.stringify(resetStats));
    setUsageStats(resetStats);
  };

  return { usageStats, resetUsageStats };
}

// Helper function to determine appropriate cache TTL based on the URL or query key
function getCacheTTLForEndpoint(url: string, queryKey: QueryKey): number {
  // Check URL patterns
  if (url.includes('/v1/marketstatus')) {
    return CACHE_TTL.MARKET_STATUS;
  }
  if (url.includes('/v2/snapshot') && url.includes('tickers')) {
    return CACHE_TTL.MARKET_INDICES;
  }
  if (url.includes('/v2/aggs')) {
    return CACHE_TTL.AGGREGATE_DATA;
  }
  
  // Check query key patterns (as string)
  const keyString = queryKey.join(',');
  if (keyString.includes('technicals')) {
    return CACHE_TTL.TECHNICAL_DATA;
  }
  if (keyString.includes('screener')) {
    return CACHE_TTL.SCREENER_RESULTS;
  }
  if (keyString.includes('watchlist')) {
    return CACHE_TTL.WATCHLIST;
  }
  
  // Default
  return CACHE_TTL.MARKET_INDICES;
}
