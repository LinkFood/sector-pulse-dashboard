
import { makeRequest } from './client';
import { 
  PolygonMarketStatusResponse, 
  PolygonSnapshotResponse,
  MarketStatus,
  MarketIndex,
  SectorPerformance
} from './types';

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
