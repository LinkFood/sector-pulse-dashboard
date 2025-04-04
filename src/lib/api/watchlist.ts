
import { makeRequest } from './client';
import { PolygonSnapshotResponse, WatchlistItem } from './types';

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
