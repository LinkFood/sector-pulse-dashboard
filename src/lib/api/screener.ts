
import { makeRequest } from './client';

export interface ScreenerParams {
  minPrice?: number;
  maxPrice?: number;
  minVolume?: number;
  maxVolume?: number;
  marketCap?: string; // small, mid, large
  sector?: string;
  above50dma?: boolean;
  below50dma?: boolean;
  above200dma?: boolean;
  below200dma?: boolean;
  minRsi?: number;
  maxRsi?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  limit?: number;
  page?: number;
}

export interface ScreenerResult {
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  sector?: string;
  industry?: string;
  pe?: number;
  eps?: number;
  movingAvg50d?: number;
  movingAvg200d?: number;
  rsi?: number;
}

// Convert our params to Polygon API params
const mapParamsToApiParams = (params: ScreenerParams) => {
  // Starting with a base set of params
  const apiParams: Record<string, any> = {
    active: true,
    limit: params.limit || 20,
  };
  
  // Map market cap to appropriate ranges
  if (params.marketCap) {
    switch(params.marketCap) {
      case 'small':
        apiParams.market_cap_min = 300000000;
        apiParams.market_cap_max = 2000000000;
        break;
      case 'mid':
        apiParams.market_cap_min = 2000000000;
        apiParams.market_cap_max = 10000000000;
        break;
      case 'large':
        apiParams.market_cap_min = 10000000000;
        break;
    }
  }
  
  // Add other filters
  if (params.minPrice) apiParams.min_price = params.minPrice;
  if (params.maxPrice) apiParams.max_price = params.maxPrice;
  if (params.minVolume) apiParams.min_volume = params.minVolume;
  if (params.maxVolume) apiParams.max_volume = params.maxVolume;
  if (params.sector) apiParams.sector = params.sector;
  if (params.sortBy) {
    // Use the sortBy value directly without prefixing with market_
    apiParams.sort = params.sortBy;
    if (params.sortDirection) apiParams.sort_direction = params.sortDirection;
  }
  
  return apiParams;
};

export const fetchScreenerResults = async (params: ScreenerParams): Promise<ScreenerResult[]> => {
  try {
    const apiParams = mapParamsToApiParams(params);
    
    // First fetch basic ticker data
    const tickers = await makeRequest<any>('/v3/reference/tickers', apiParams);
    
    if (!tickers.results || tickers.results.length === 0) {
      return [];
    }
    
    // Get ticker symbols for snapshot request
    const tickerSymbols = tickers.results.map((result: any) => result.ticker);
    
    // Fetch snapshots for these tickers to get current price data
    const snapshots = await makeRequest<any>('/v2/snapshot/locale/us/markets/stocks/tickers', {
      tickers: tickerSymbols.join(',')
    });
    
    // Combine data from both endpoints
    return tickers.results.map((ticker: any) => {
      const snapshot = snapshots.tickers?.find((t: any) => t.ticker === ticker.ticker);
      
      return {
        ticker: ticker.ticker,
        name: ticker.name,
        price: snapshot?.day?.c || 0,
        change: snapshot?.todaysChange || 0,
        changePercent: snapshot?.todaysChangePerc || 0,
        volume: snapshot?.day?.v || 0,
        marketCap: ticker.market_cap || undefined,
        sector: ticker.sic_description || undefined,
        industry: ticker.composite_figi || undefined,
        // Additional fields that would need more API calls to populate
        pe: undefined,
        eps: undefined,
        movingAvg50d: undefined,
        movingAvg200d: undefined,
        rsi: undefined
      };
    });
  } catch (error) {
    console.error('Error fetching screener results:', error);
    throw error;
  }
};

export const getSectors = async (): Promise<string[]> => {
  try {
    const response = await makeRequest<any>('/v3/reference/tickers', { 
      market: 'stocks',
      active: true,
      limit: 100
    });
    
    // Extract unique sectors
    const sectors = new Set<string>();
    response.results.forEach((ticker: any) => {
      if (ticker.sic_description) {
        sectors.add(ticker.sic_description);
      }
    });
    
    return Array.from(sectors).sort();
  } catch (error) {
    console.error('Error fetching sectors:', error);
    return [];
  }
};
