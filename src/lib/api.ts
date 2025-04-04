import axios from 'axios';
import { toast } from '@/components/ui/use-toast';

// Initialize Axios instance with default configuration
const api = axios.create({
  baseURL: 'https://api.polygon.io', 
  timeout: 10000,
});

// Placeholder for API key - would come from environment variables in production
// In a real app, you would store this in a .env file or use a secret manager
let API_KEY = '';

export const setApiKey = (key: string) => {
  API_KEY = key;
  localStorage.setItem('polygon_api_key', key);
};

export const getApiKey = (): string => {
  if (!API_KEY) {
    API_KEY = localStorage.getItem('polygon_api_key') || '';
  }
  return API_KEY;
};

// Helper to ensure API key is available
const checkApiKey = () => {
  const key = getApiKey();
  if (!key) {
    throw new Error('API key not configured');
  }
  return key;
};

// API request wrapper with error handling
const makeRequest = async <T>(url: string, params: Record<string, any> = {}): Promise<T> => {
  try {
    const apiKey = checkApiKey();
    console.log('API Request Details:', {
      url,
      params: { ...params, apiKey: apiKey ? '****' : 'No API Key' }
    });

    const response = await api.get<T>(url, {
      params: {
        ...params,
        apiKey,
      },
    });

    console.log('API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Full API Error:', error);
    
    if (axios.isAxiosError(error)) {
      console.error('Axios Error Details:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });

      if (error.response?.status === 401) {
        toast({
          title: 'API Key Error',
          description: 'Your API key is invalid or has expired. Please check your Polygon.io API key.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'API Error',
          description: `Request failed: ${error.message}. Check console for details.`,
          variant: 'destructive',
        });
      }
    } else {
      toast({
        title: 'Unexpected Error',
        description: 'An unknown error occurred during the API request.',
        variant: 'destructive',
      });
    }
    throw error;
  }
};

// Type definitions
export interface MarketStatus {
  market: string;
  serverTime: string;
  exchanges: {
    [key: string]: {
      name: string;
      status: string;
      sessionOpen: string;
      sessionClose: string;
    };
  };
  currencies: {
    [key: string]: {
      name: string;
      status: string;
      currencySymbol: string;
    };
  };
}

export interface MarketIndex {
  ticker: string;
  name: string; 
  market: string;
  locale: string;
  value: number;
  change: number;
  changePercent: number;
  lastUpdated: string;
}

export interface StockQuote {
  ticker: string;
  todaysChange: number;
  todaysChangePerc: number;
  currentPrice: number;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  previousClose: number;
  volume: number;
}

export interface SectorPerformance {
  sector: string;
  performance: number;
  change: number;
}

interface PolygonMarketStatusResponse {
  market: string;
  serverTime: string;
  exchanges: {
    [key: string]: {
      name: string;
      status: string;
      sessionOpen: string;
      sessionClose: string;
    };
  };
  currencies: {
    [key: string]: {
      name: string;
      status: string;
      currencySymbol: string;
    };
  };
}

interface PolygonAggResponse {
  ticker: string;
  status: string;
  queryCount: number;
  resultsCount: number;
  adjusted: boolean;
  results: {
    v: number;        // volume
    vw: number;       // volume weighted price
    o: number;        // open
    c: number;        // close
    h: number;        // high
    l: number;        // low
    t: number;        // timestamp
    n: number;        // number of transactions
  }[];
  request_id: string;
  count: number;
}

interface PolygonSnapshotResponse {
  status: string;
  results: {
    [ticker: string]: {
      ticker: string;
      day: {
        o: number;
        h: number;
        l: number;
        c: number;
        v: number;
        vw: number;
      };
      lastQuote: {
        P: number;  // ask price
        S: number;  // ask size
        p: number;  // bid price
        s: number;  // bid size
        t: number;  // timestamp
      };
      lastTrade: {
        c: any[];   // conditions
        i: number;  // trade ID
        p: number;  // price
        s: number;  // size
        t: number;  // timestamp
        x: number;  // exchange ID
      };
      min: {
        av: number; // accumulated volume
        o: number;  // open
        h: number;  // high
        l: number;  // low
        c: number;  // close
        v: number;  // volume
        vw: number; // volume weighted
      };
      prevDay: {
        o: number;  // open
        h: number;  // high
        l: number;  // low
        c: number;  // close
        v: number;  // volume
        vw: number; // volume weighted
      };
    }
  };
}

// Fetch market status from Polygon.io
export const fetchMarketStatus = async (): Promise<MarketStatus> => {
  try {
    const response = await makeRequest<PolygonMarketStatusResponse>('/v1/marketstatus/now');
    return {
      market: response.market,
      serverTime: response.serverTime,
      exchanges: response.exchanges,
      currencies: response.currencies
    };
  } catch (error) {
    console.error("Failed to fetch market status:", error);
    // Return a fallback status
    return {
      market: "unknown",
      serverTime: new Date().toISOString(),
      exchanges: {},
      currencies: {}
    };
  }
};

// These are ETFs that track major indices
const indexTickers = [
  { ticker: "SPY", name: "S&P 500" },
  { ticker: "DIA", name: "Dow Jones Industrial Average" },
  { ticker: "QQQ", name: "Nasdaq Composite" },
  { ticker: "IWM", name: "Russell 2000" }
];

// Fetch market indices from Polygon.io
export const fetchMarketIndices = async (): Promise<MarketIndex[]> => {
  try {
    const tickers = indexTickers.map(index => index.ticker).join(',');
    const response = await makeRequest<PolygonSnapshotResponse>(`/v2/snapshot/tickers?tickers=${tickers}`);
    
    return indexTickers.map(index => {
      const ticker = index.ticker;
      const tickerData = response.results[ticker];
      
      if (!tickerData) {
        return {
          ticker,
          name: index.name,
          market: "stocks",
          locale: "us",
          value: 0,
          change: 0,
          changePercent: 0,
          lastUpdated: new Date().toISOString()
        };
      }
      
      const currentPrice = tickerData.lastTrade?.p || tickerData.day?.c || 0;
      const previousClose = tickerData.prevDay?.c || 0;
      const change = currentPrice - previousClose;
      const changePercent = previousClose !== 0 ? (change / previousClose) * 100 : 0;
      
      return {
        ticker,
        name: index.name,
        market: "stocks",
        locale: "us",
        value: currentPrice,
        change,
        changePercent,
        lastUpdated: tickerData.lastTrade?.t 
          ? new Date(tickerData.lastTrade.t).toISOString()
          : new Date().toISOString()
      };
    });
  } catch (error) {
    console.error("Failed to fetch market indices:", error);
    // Return fallback indices data
    return indexTickers.map(index => ({
      ticker: index.ticker,
      name: index.name,
      market: "stocks",
      locale: "us",
      value: 0,
      change: 0,
      changePercent: 0,
      lastUpdated: new Date().toISOString()
    }));
  }
};

// Map of sector ETFs to sector names
const sectorETFs = [
  { ticker: "XLK", sector: "Technology" },
  { ticker: "XLV", sector: "Healthcare" },
  { ticker: "XLF", sector: "Financials" },
  { ticker: "XLY", sector: "Consumer Discretionary" },
  { ticker: "XLC", sector: "Communication Services" },
  { ticker: "XLI", sector: "Industrials" },
  { ticker: "XLP", sector: "Consumer Staples" },
  { ticker: "XLE", sector: "Energy" },
  { ticker: "XLU", sector: "Utilities" },
  { ticker: "XLRE", sector: "Real Estate" },
  { ticker: "XLB", sector: "Materials" }
];

// Fetch sector performance using sector ETFs from Polygon.io
export const fetchSectorPerformance = async (): Promise<SectorPerformance[]> => {
  try {
    const tickers = sectorETFs.map(etf => etf.ticker).join(',');
    const response = await makeRequest<PolygonSnapshotResponse>(`/v2/snapshot/tickers?tickers=${tickers}`);
    
    return sectorETFs.map(etf => {
      const ticker = etf.ticker;
      const tickerData = response.results[ticker];
      
      if (!tickerData) {
        return {
          sector: etf.sector,
          performance: 0,
          change: 0
        };
      }
      
      const currentPrice = tickerData.lastTrade?.p || tickerData.day?.c || 0;
      const previousClose = tickerData.prevDay?.c || 0;
      const change = currentPrice - previousClose;
      const performance = previousClose !== 0 ? (change / previousClose) * 100 : 0;
      
      return {
        sector: etf.sector,
        performance,
        change
      };
    });
  } catch (error) {
    console.error("Failed to fetch sector performance:", error);
    // Return fallback sector data
    return sectorETFs.map(etf => ({
      sector: etf.sector,
      performance: 0,
      change: 0
    }));
  }
};

// Watchlist types and functions
export interface WatchlistItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

// Get stock name from symbol (simplified version)
const getStockName = (symbol: string): string => {
  const commonStocks: Record<string, string> = {
    "AAPL": "Apple Inc.",
    "MSFT": "Microsoft Corporation",
    "GOOGL": "Alphabet Inc.",
    "AMZN": "Amazon.com Inc.",
    "NVDA": "NVIDIA Corporation",
    "META": "Meta Platforms Inc.",
    "TSLA": "Tesla, Inc.",
    "NFLX": "Netflix, Inc.",
    "DIS": "The Walt Disney Company",
    "BA": "Boeing Company",
  };
  
  return commonStocks[symbol] || symbol;
};

// Fetch watchlist data from Polygon.io
export const fetchWatchlistData = async (symbols: string[]): Promise<WatchlistItem[]> => {
  if (!symbols || symbols.length === 0) {
    // Default watchlist for demonstration
    symbols = ["AAPL", "MSFT", "GOOGL", "AMZN", "NVDA"];
  }
  
  try {
    const tickers = symbols.join(',');
    const response = await makeRequest<PolygonSnapshotResponse>(`/v2/snapshot/tickers?tickers=${tickers}`);
    
    return symbols.map(symbol => {
      const tickerData = response.results[symbol];
      
      if (!tickerData) {
        return {
          symbol,
          name: getStockName(symbol),
          price: 0,
          change: 0,
          changePercent: 0
        };
      }
      
      const currentPrice = tickerData.lastTrade?.p || tickerData.day?.c || 0;
      const previousClose = tickerData.prevDay?.c || 0;
      const change = currentPrice - previousClose;
      const changePercent = previousClose !== 0 ? (change / previousClose) * 100 : 0;
      
      return {
        symbol,
        name: getStockName(symbol),
        price: currentPrice,
        change,
        changePercent
      };
    });
  } catch (error) {
    console.error("Failed to fetch watchlist data:", error);
    // Return fallback watchlist data
    return symbols.map(symbol => ({
      symbol,
      name: getStockName(symbol),
      price: 0,
      change: 0,
      changePercent: 0
    }));
  }
};

// Helper function to properly format the API key parameter for Polygon.io
const formatApiKeyParam = (apiKey: string): string => {
  return `apiKey=${apiKey}`;
};

export default {
  setApiKey,
  getApiKey,
  fetchMarketStatus,
  fetchMarketIndices,
  fetchSectorPerformance,
  fetchWatchlistData,
};
