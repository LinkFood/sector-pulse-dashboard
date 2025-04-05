
import { makeRequest } from './client';
import { getApiKey } from './config';

// Types for market breadth data
export interface StockSnapshot {
  ticker: string;
  price: number;
  prevClose: number;
  change: number;
  changePercent: number;
  ma50: number;
  ma200: number;
  high52W: number;
  low52W: number;
  marketCap?: number;
  isAboveSMA50?: boolean;
  isAboveSMA200?: boolean;
  isNewHigh?: boolean;
  isNewLow?: boolean;
}

export interface MarketBreadthData {
  advancing: number;
  declining: number;
  unchanged: number;
  aboveSMA50: number;
  aboveSMA200: number;
  newHighs: number;
  newLows: number;
  total: number;
  stocks: StockSnapshot[];
}

export interface BreadthOscillatorData {
  date: string;
  value: number;
}

// Market segments based on market cap (in billions)
export enum MarketSegment {
  ALL = 'All',
  LARGE_CAP = 'Large Cap', // > $10B
  MID_CAP = 'Mid Cap',     // $2B - $10B
  SMALL_CAP = 'Small Cap'  // < $2B
}

// Mock data based on common stocks for demonstration
export const fetchMarketBreadthData = async (
  timeframe: string = '1D',
  segment: MarketSegment = MarketSegment.ALL
): Promise<MarketBreadthData> => {
  try {
    // For a real implementation, we would use these parameters to fetch data from Polygon
    console.log(`Fetching breadth data for timeframe: ${timeframe}, segment: ${segment}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock data for S&P 500 components (simplified subset)
    const mockStocks: StockSnapshot[] = generateMockStockData(segment);
    
    // Calculate breadth metrics
    const advancing = mockStocks.filter(stock => stock.change > 0).length;
    const declining = mockStocks.filter(stock => stock.change < 0).length;
    const unchanged = mockStocks.filter(stock => stock.change === 0).length;
    const aboveSMA50 = mockStocks.filter(stock => stock.isAboveSMA50).length;
    const aboveSMA200 = mockStocks.filter(stock => stock.isAboveSMA200).length;
    const newHighs = mockStocks.filter(stock => stock.isNewHigh).length;
    const newLows = mockStocks.filter(stock => stock.isNewLow).length;
    
    return {
      advancing,
      declining,
      unchanged,
      aboveSMA50,
      aboveSMA200,
      newHighs,
      newLows,
      total: mockStocks.length,
      stocks: mockStocks
    };
  } catch (error) {
    console.error("Failed to fetch market breadth data:", error);
    throw error;
  }
};

export const fetchBreadthOscillatorData = async (
  timeframe: string = '1M'
): Promise<BreadthOscillatorData[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Generate mock oscillator data
  const data: BreadthOscillatorData[] = [];
  let days = 30;
  
  switch (timeframe) {
    case '1D': days = 1; break;
    case '1W': days = 7; break;
    case '1M': days = 30; break;
    case '3M': days = 90; break;
    case '6M': days = 180; break;
    case '1Y': days = 365; break;
    default: days = 30;
  }
  
  const endDate = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const currentDate = new Date(endDate);
    currentDate.setDate(endDate.getDate() - i);
    
    // Generate oscillator value between -100 and 100
    let prevValue = data.length > 0 ? data[data.length - 1].value : 0;
    let change = (Math.random() * 20) - 10; // Random change between -10 and 10
    let newValue = Math.max(-100, Math.min(100, prevValue + change)); // Clamp between -100 and 100
    
    data.push({
      date: currentDate.toISOString().split('T')[0],
      value: parseFloat(newValue.toFixed(2))
    });
  }
  
  return data;
};

// Helper function to generate mock stock data
function generateMockStockData(segment: MarketSegment): StockSnapshot[] {
  const allStocks: StockSnapshot[] = [
    // Large cap stocks (simplified for demonstration)
    { ticker: "AAPL", price: 185.92, prevClose: 183.58, change: 2.34, changePercent: 1.27, ma50: 180.25, ma200: 175.84, high52W: 198.23, low52W: 155.98, marketCap: 2800 },
    { ticker: "MSFT", price: 415.33, prevClose: 411.22, change: 4.11, changePercent: 1.00, ma50: 405.45, ma200: 380.17, high52W: 420.82, low52W: 309.47, marketCap: 3100 },
    { ticker: "AMZN", price: 178.22, prevClose: 180.55, change: -2.33, changePercent: -1.29, ma50: 182.30, ma200: 165.75, high52W: 189.90, low52W: 118.35, marketCap: 1850 },
    { ticker: "GOOGL", price: 142.76, prevClose: 143.98, change: -1.22, changePercent: -0.85, ma50: 145.10, ma200: 138.25, high52W: 153.78, low52W: 115.35, marketCap: 1750 },
    { ticker: "META", price: 472.22, prevClose: 465.87, change: 6.35, changePercent: 1.36, ma50: 455.70, ma200: 410.55, high52W: 485.95, low52W: 279.40, marketCap: 1200 },
    
    // Mid cap stocks
    { ticker: "ETSY", price: 68.33, prevClose: 70.24, change: -1.91, changePercent: -2.72, ma50: 72.15, ma200: 80.44, high52W: 102.23, low52W: 61.78, marketCap: 8.2 },
    { ticker: "PINS", price: 42.55, prevClose: 41.78, change: 0.77, changePercent: 1.84, ma50: 40.25, ma200: 37.82, high52W: 45.67, low52W: 25.14, marketCap: 9.5 },
    { ticker: "ROKU", price: 62.45, prevClose: 61.32, change: 1.13, changePercent: 1.84, ma50: 60.85, ma200: 68.35, high52W: 89.76, low52W: 44.23, marketCap: 8.8 },
    
    // Small cap stocks
    { ticker: "CRSR", price: 14.25, prevClose: 14.78, change: -0.53, changePercent: -3.59, ma50: 15.20, ma200: 16.45, high52W: 22.34, low52W: 13.15, marketCap: 1.5 },
    { ticker: "PLBY", price: 0.78, prevClose: 0.82, change: -0.04, changePercent: -4.88, ma50: 0.95, ma200: 1.45, high52W: 3.24, low52W: 0.67, marketCap: 0.2 },
    { ticker: "ARVL", price: 0.12, prevClose: 0.11, change: 0.01, changePercent: 9.09, ma50: 0.15, ma200: 0.35, high52W: 1.11, low52W: 0.08, marketCap: 0.1 },
  ];
  
  // Filter based on segment
  let filteredStocks: StockSnapshot[];
  
  switch (segment) {
    case MarketSegment.LARGE_CAP:
      filteredStocks = allStocks.filter(stock => stock.marketCap && stock.marketCap >= 10);
      break;
    case MarketSegment.MID_CAP:
      filteredStocks = allStocks.filter(stock => stock.marketCap && stock.marketCap >= 2 && stock.marketCap < 10);
      break;
    case MarketSegment.SMALL_CAP:
      filteredStocks = allStocks.filter(stock => stock.marketCap && stock.marketCap < 2);
      break;
    default:
      filteredStocks = allStocks;
  }
  
  // Add derived properties
  return filteredStocks.map(stock => ({
    ...stock,
    isAboveSMA50: stock.price > stock.ma50,
    isAboveSMA200: stock.price > stock.ma200,
    isNewHigh: stock.price > (stock.high52W * 0.98), // Within 2% of 52-week high
    isNewLow: stock.price < (stock.low52W * 1.02)    // Within 2% of 52-week low
  }));
}
