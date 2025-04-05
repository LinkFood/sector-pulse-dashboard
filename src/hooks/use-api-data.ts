import { useQuery, useMutation, useQueryClient, QueryKey } from '@tanstack/react-query';
import { makeRequest, prefetchData, batchRequests } from '@/lib/api/client';
import { useState, useEffect } from 'react';
import { CACHE_TTL } from '@/lib/api/cache';
import { useDataSource } from '@/context/DataSourceContext';

// Hook for fetching data with optimized settings for unlimited API access
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
    select?: (data: T) => any;
  } = {}
) {
  // Get dataSource context to register our data source
  const { registerDataSource } = useDataSource();
  const queryKeyString = Array.isArray(queryKey) ? queryKey.join('-') : String(queryKey);
  
  // Shorter stale times since we have unlimited API calls
  const cacheTTL = options.cacheTTL || getCacheTTLForEndpoint(url, queryKey);
  const staleTime = options.staleTime !== undefined ? options.staleTime : Math.min(cacheTTL, 60000); // Max 1 minute stale time

  const originalSelect = options.select;

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      return makeRequest<T>(url, params, {
        cacheTTL,
      });
    },
    staleTime,
    retry: options.retry !== undefined ? options.retry : 2, // Increased retries since we have unlimited API calls
    enabled: options.enabled !== undefined ? options.enabled : true,
    refetchInterval: options.refetchInterval || 60000, // Default to 1 minute refetch
    select: (data: T) => {
      if (!data) {
        // If no data, mark as mock and return
        registerDataSource(queryKeyString, 'mock', url);
        return originalSelect ? originalSelect(data) : data;
      }

      // Check if this is real API data or mock data
      const isMockData = detectMockData(data);
      
      // Register the data source
      registerDataSource(
        queryKeyString, 
        isMockData ? 'mock' : 'api', 
        url
      );
      
      console.log(`[DataSource] ${queryKeyString} using ${isMockData ? 'MOCK' : 'API'} data from ${url}`);
      
      // Call the original select function if provided
      return originalSelect ? originalSelect(data) : data;
    }
  });

  return query;
}

// Helper function to detect if data is mock
function detectMockData<T>(data: T): boolean {
  // Check for common patterns in our mock data
  
  // Check for sectors mock data
  if (Array.isArray(data) && data.length > 0 && 'sector' in data[0] && 'performance' in data[0]) {
    // Check if all sectors have the same performance or if they match our hardcoded values
    const hardcodedValues = [2.5, 0.8, -0.5, 1.2, 0.3, -0.2, -1.5, 0.7, -0.6, -1.0, -0.9];
    const performances = data.map((item: any) => item.performance);
    
    // If the first few values match our hardcoded mock data
    if (performances.slice(0, 3).join(',') === hardcodedValues.slice(0, 3).join(',')) {
      return true;
    }
  }
  
  // Check for fallbacks in API responses with custom properties
  if (typeof data === 'object' && data !== null) {
    if ('sectors' in data) {
      const sectors = (data as any).sectors;
      if (Array.isArray(sectors) && sectors.length > 0) {
        // Check if sectors data matches our common mock data patterns
        const firstSector = sectors[0];
        if (firstSector && 'sector' in firstSector && 'performance' in firstSector) {
          // Check for Technology with exactly 2.5% performance (our mock value)
          if (firstSector.sector === 'Technology' && firstSector.performance === 2.5) {
            return true;
          }
        }
      }
    }
  }
  
  // If the data is very simple or has default-looking values
  if (typeof data === 'object' && data !== null && Object.keys(data).length === 0) {
    return true;
  }
  
  return false;
}

// Hook for prefetching data that will likely be needed soon - optimized for unlimited API calls
export function usePrefetch<T>(url: string, params: Record<string, any> = {}, queryKey: QueryKey) {
  const queryClient = useQueryClient();
  const cacheTTL = getCacheTTLForEndpoint(url, queryKey);

  const triggerPrefetch = () => {
    // Since we have unlimited API calls, we can be more aggressive with prefetching
    prefetchData<T>(url, params, { cacheTTL });
  };

  return { triggerPrefetch };
}

// Hook for batched requests - optimized for unlimited API calls
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
      });
    },
    staleTime: Math.min(cacheTTL, 60000), // Max 1 minute stale time
    retry: options.retry !== undefined ? options.retry : 2, // Increased retries
    enabled: options.enabled !== undefined ? options.enabled : true,
    refetchInterval: options.refetchInterval || 60000, // Default to 1 minute refetch
  });
}

// Hook to track API usage statistics - simplified for unlimited API calls
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

  // For unlimited API calls, we can simply reset the stats counter without concerns
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
// With unlimited API calls, we use shorter TTLs
function getCacheTTLForEndpoint(url: string, queryKey: QueryKey): number {
  // Check URL patterns
  if (url.includes('/v1/marketstatus')) {
    return CACHE_TTL.MARKET_STATUS / 2; // Half the original TTL
  }
  if (url.includes('/v2/snapshot') && url.includes('tickers')) {
    return CACHE_TTL.MARKET_INDICES / 2;
  }
  if (url.includes('/v2/aggs')) {
    return CACHE_TTL.AGGREGATE_DATA / 2;
  }
  
  // Check query key patterns
  const keyString = queryKey.join(',');
  if (keyString.includes('technicals')) {
    return CACHE_TTL.TECHNICAL_DATA / 2;
  }
  if (keyString.includes('screener')) {
    return CACHE_TTL.SCREENER_RESULTS / 2;
  }
  if (keyString.includes('watchlist')) {
    return CACHE_TTL.WATCHLIST / 2;
  }
  
  // Default - shorter TTL since we have unlimited API calls
  return CACHE_TTL.MARKET_INDICES / 2;
}
