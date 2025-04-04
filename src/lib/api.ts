
import axios from 'axios';
import { toast } from 'sonner';

// Initialize Axios instance with default configuration
const api = axios.create({
  baseURL: 'https://api.polygon.io', 
  timeout: 15000, // Increased timeout for reliability
});

// Placeholder for API key - would come from environment variables in production
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
    console.log('API Response Headers:', response.headers);
    console.log('API Response Data:', response.data);
    
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
    } else {
      toast.error('Unexpected error during API request.');
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

interface PolygonSnapshotResponse {
  status: string;
  request_id: string;
  tickers: Array<{
    day: {
      c: number;
      h: number;
      l: number;
      o: number;
      v: number;
      vw: number;
    };
    lastQuote: {
      P: number;
      S: number;
      p: number;
      s: number;
      t: number;
    };
    lastTrade: {
      c: number[];
      i: string;
      p: number;
      s: number;
      t: number;
      x: number;
    };
    min: {
      av: number;
      c: number;
      h: number;
      l: number;
      o: number;
      v: number;
      vw: number;
    };
    prevDay: {
      c: number;
      h: number;
      l: number;
      o: number;
      v: number;
      vw: number;
    };
    ticker: string;
    todaysChange: number;
    todaysChangePerc: number;
    updated: number;
  }>
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

// Fetch market indices from Polygon.io using the snapshot endpoint
export const fetchMarketIndices = async (): Promise<MarketIndex[]> => {
  try {
    const tickers = indexTickers.map(index => index.ticker).join(',');
    const response = await makeRequest<PolygonSnapshotResponse>(`/v2/snapshot/locale/us/markets/stocks/tickers?tickers=${tickers}`);
    
    if (!response.tickers || response.tickers.length === 0) {
      console.error('No ticker data returned from API');
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
    
    return response.tickers.map(tickerData => {
      const indexInfo = indexTickers.find(i => i.ticker === tickerData.ticker);
      
      return {
        ticker: tickerData.ticker,
        name: indexInfo?.name || tickerData.ticker,
        market: "stocks",
        locale: "us",
        value: tickerData.lastTrade?.p || tickerData.day?.c || 0,
        change: tickerData.todaysChange,
        changePercent: tickerData.todaysChangePerc,
        lastUpdated: tickerData.updated ? new Date(tickerData.updated).toISOString() : new Date().toISOString()
      };
    });
  } catch (error) {
    console.error("Failed to fetch market indices:", error);
    
    // Return fallback data
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
    const response = await makeRequest<PolygonSnapshotResponse>(`/v2/snapshot/locale/us/markets/stocks/tickers?tickers=${tickers}`);
    
    if (!response.tickers || response.tickers.length === 0) {
      console.error('No sector data returned from API');
      return sectorETFs.map(etf => ({
        sector: etf.sector,
        performance: 0,
        change: 0
      }));
    }
    
    return response.tickers.map(tickerData => {
      const sectorInfo = sectorETFs.find(s => s.ticker === tickerData.ticker);
      
      return {
        sector: sectorInfo?.sector || tickerData.ticker,
        performance: tickerData.todaysChangePerc,
        change: tickerData.todaysChange
      };
    });
  } catch (error) {
    console.error("Failed to fetch sector performance:", error);
    
    // Return fallback data
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
    const response = await makeRequest<PolygonSnapshotResponse>(`/v2/snapshot/locale/us/markets/stocks/tickers?tickers=${tickers}`);
    
    if (!response.tickers || response.tickers.length === 0) {
      console.error('No watchlist data returned from API');
      return symbols.map(symbol => ({
        symbol,
        name: getStockName(symbol),
        price: 0,
        change: 0,
        changePercent: 0
      }));
    }
    
    // Create a map for quick lookup
    const tickerDataMap = new Map(
      response.tickers.map(ticker => [ticker.ticker, ticker])
    );
    
    return symbols.map(symbol => {
      const tickerData = tickerDataMap.get(symbol);
      
      if (!tickerData) {
        return {
          symbol,
          name: getStockName(symbol),
          price: 0,
          change: 0,
          changePercent: 0
        };
      }
      
      return {
        symbol,
        name: getStockName(symbol),
        price: tickerData.lastTrade?.p || tickerData.day?.c || 0,
        change: tickerData.todaysChange,
        changePercent: tickerData.todaysChangePerc
      };
    });
  } catch (error) {
    console.error("Failed to fetch watchlist data:", error);
    
    // Return fallback data
    return symbols.map(symbol => ({
      symbol,
      name: getStockName(symbol),
      price: 0,
      change: 0,
      changePercent: 0
    }));
  }
};

export default {
  setApiKey,
  getApiKey,
  fetchMarketStatus,
  fetchMarketIndices,
  fetchSectorPerformance,
  fetchWatchlistData,
};
