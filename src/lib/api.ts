
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
    const response = await api.get<T>(url, {
      params: {
        ...params,
        apiKey,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        toast({
          title: 'API Key Error',
          description: 'Your API key is invalid or has expired',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'API Error',
          description: error.message || 'Failed to fetch data',
          variant: 'destructive',
        });
      }
    } else {
      toast({
        title: 'Error',
        description: 'An unknown error occurred',
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

// Placeholder data (will be replaced with actual API calls)
export const fetchMarketStatus = async (): Promise<MarketStatus> => {
  // Placeholder - would fetch from `/v1/marketstatus/now` endpoint
  return {
    market: "open",
    serverTime: new Date().toISOString(),
    exchanges: {
      nasdaq: {
        name: "NASDAQ",
        status: "open",
        sessionOpen: "09:30:00",
        sessionClose: "16:00:00",
      },
      nyse: {
        name: "New York Stock Exchange",
        status: "open",
        sessionOpen: "09:30:00",
        sessionClose: "16:00:00",
      },
    },
    currencies: {
      fx: {
        name: "Forex",
        status: "open",
        currencySymbol: "$",
      },
    },
  };
};

// Mock data - in a real app these would fetch from the Polygon.io API
export const fetchMarketIndices = async (): Promise<MarketIndex[]> => {
  // This would be `/v3/indices` in the real API
  return [
    {
      ticker: "SPY",
      name: "S&P 500",
      market: "stocks",
      locale: "us",
      value: 4780.23,
      change: 32.5,
      changePercent: 0.68,
      lastUpdated: new Date().toISOString(),
    },
    {
      ticker: "DIA",
      name: "Dow Jones Industrial Average",
      market: "stocks",
      locale: "us",
      value: 38564.12,
      change: -42.76,
      changePercent: -0.11,
      lastUpdated: new Date().toISOString(),
    },
    {
      ticker: "QQQ",
      name: "Nasdaq Composite",
      market: "stocks",
      locale: "us",
      value: 16741.52,
      change: 180.95,
      changePercent: 1.09,
      lastUpdated: new Date().toISOString(),
    },
    {
      ticker: "IWM",
      name: "Russell 2000",
      market: "stocks",
      locale: "us",
      value: 2007.31,
      change: -5.41,
      changePercent: -0.27,
      lastUpdated: new Date().toISOString(),
    },
  ];
};

// Mock sector performance data
export const fetchSectorPerformance = async (): Promise<SectorPerformance[]> => {
  return [
    { sector: "Technology", performance: 1.24, change: 0.35 },
    { sector: "Healthcare", performance: 0.78, change: -0.12 },
    { sector: "Financials", performance: -0.41, change: -0.68 },
    { sector: "Consumer Discretionary", performance: 0.92, change: 0.23 },
    { sector: "Communication Services", performance: 1.56, change: 0.45 },
    { sector: "Industrials", performance: 0.31, change: 0.08 },
    { sector: "Consumer Staples", performance: -0.18, change: -0.27 },
    { sector: "Energy", performance: -1.23, change: -0.85 },
    { sector: "Utilities", performance: -0.53, change: -0.22 },
    { sector: "Real Estate", performance: 0.12, change: 0.04 },
    { sector: "Materials", performance: -0.37, change: -0.19 },
  ];
};

// Watchlist types and functions
export interface WatchlistItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export const fetchWatchlistData = async (symbols: string[]): Promise<WatchlistItem[]> => {
  // This would call the real-time quotes endpoint
  return [
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      price: 182.63,
      change: 3.26,
      changePercent: 1.82,
    },
    {
      symbol: "MSFT",
      name: "Microsoft Corporation",
      price: 415.42,
      change: 5.31,
      changePercent: 1.29,
    },
    {
      symbol: "GOOGL",
      name: "Alphabet Inc.",
      price: 174.13,
      change: 1.45,
      changePercent: 0.84,
    },
    {
      symbol: "AMZN",
      name: "Amazon.com Inc.",
      price: 178.87,
      change: 2.13,
      changePercent: 1.2,
    },
    {
      symbol: "NVDA",
      name: "NVIDIA Corporation",
      price: 924.79,
      change: 18.43,
      changePercent: 2.03,
    },
  ];
};

export default {
  setApiKey,
  getApiKey,
  fetchMarketStatus,
  fetchMarketIndices,
  fetchSectorPerformance,
  fetchWatchlistData,
};
