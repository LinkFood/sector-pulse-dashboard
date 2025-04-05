
import { AggregateBar } from "../api/volume";
import { ProcessedBar } from "./types";

// Calculate Simple Moving Average
export const calculateSMA = (data: number[], period: number): number | undefined => {
  if (data.length < period) return undefined;
  
  const sum = data.slice(0, period).reduce((acc, val) => acc + val, 0);
  return sum / period;
};

// Calculate Exponential Moving Average
export const calculateEMA = (
  currentPrice: number,
  previousEMA: number | undefined,
  period: number,
): number => {
  if (previousEMA === undefined) return currentPrice;
  
  const k = 2 / (period + 1);
  return currentPrice * k + previousEMA * (1 - k);
};

// Calculate Bollinger Bands
export const calculateBollingerBands = (
  sma: number, 
  prices: number[], 
  period: number,
  deviation: number = 2
): { upper: number; middle: number; lower: number } => {
  // Calculate standard deviation
  const squaredDifferences = prices.map(price => Math.pow(price - sma, 2));
  const variance = squaredDifferences.reduce((sum, value) => sum + value, 0) / period;
  const stdDev = Math.sqrt(variance);
  
  // Calculate bands
  return {
    upper: sma + (stdDev * deviation),
    middle: sma,
    lower: sma - (stdDev * deviation)
  };
};

// Calculate RSI (Relative Strength Index)
export const calculateRSI = (prices: number[], period: number = 14): number | undefined => {
  if (prices.length <= period) return undefined;
  
  let gains = 0;
  let losses = 0;
  
  // Calculate initial average gain/loss
  for (let i = 1; i <= period; i++) {
    const change = prices[i] - prices[i - 1];
    if (change >= 0) {
      gains += change;
    } else {
      losses += Math.abs(change);
    }
  }
  
  let avgGain = gains / period;
  let avgLoss = losses / period;
  
  // Calculate RSI using smoothed averages
  for (let i = period + 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];
    
    if (change >= 0) {
      avgGain = ((avgGain * (period - 1)) + change) / period;
      avgLoss = ((avgLoss * (period - 1))) / period;
    } else {
      avgGain = ((avgGain * (period - 1))) / period;
      avgLoss = ((avgLoss * (period - 1)) + Math.abs(change)) / period;
    }
  }
  
  if (avgLoss === 0) return 100;
  
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
};

// Calculate MACD (Moving Average Convergence Divergence)
export const calculateMACD = (
  prices: number[],
  fastPeriod: number = 12,
  slowPeriod: number = 26,
  signalPeriod: number = 9
): { macd: number; signal: number; histogram: number } | undefined => {
  if (prices.length < Math.max(fastPeriod, slowPeriod, signalPeriod)) {
    return undefined;
  }
  
  // Calculate EMAs
  let fastEMA = prices[prices.length - fastPeriod];
  let slowEMA = prices[prices.length - slowPeriod];
  
  for (let i = prices.length - fastPeriod + 1; i < prices.length; i++) {
    fastEMA = calculateEMA(prices[i], fastEMA, fastPeriod);
  }
  
  for (let i = prices.length - slowPeriod + 1; i < prices.length; i++) {
    slowEMA = calculateEMA(prices[i], slowEMA, slowPeriod);
  }
  
  // Calculate MACD line
  const macdLine = fastEMA - slowEMA;
  
  // Calculate signal line (EMA of MACD line)
  let signalLine = macdLine;
  
  // Calculate histogram
  const histogram = macdLine - signalLine;
  
  return {
    macd: macdLine,
    signal: signalLine,
    histogram
  };
};

// Main function to calculate all indicators
export const calculateIndicators = (
  data: AggregateBar[], 
  activeIndicators: string[] = []
): ProcessedBar[] => {
  if (!data || data.length === 0) return [];
  
  // Reverse data to ensure chronological order (oldest to newest)
  const chronologicalData = [...data].reverse();
  
  const result: ProcessedBar[] = [];
  const closingPrices = chronologicalData.map(bar => bar.c);
  
  // Process each bar with indicators
  for (let i = 0; i < chronologicalData.length; i++) {
    const bar = { ...chronologicalData[i] };
    const processedBar: ProcessedBar = { ...bar };
    
    // SMA calculation (period 20)
    if (activeIndicators.includes('sma')) {
      const period = 20;
      if (i >= period - 1) {
        const priceSlice = closingPrices.slice(i - (period - 1), i + 1);
        processedBar.sma20 = calculateSMA(priceSlice, period);
      }
    }
    
    // EMA calculation (period 9)
    if (activeIndicators.includes('ema')) {
      const period = 9;
      if (i === 0) {
        processedBar.ema9 = closingPrices[0];
      } else if (i > 0) {
        processedBar.ema9 = calculateEMA(
          closingPrices[i],
          result[i - 1].ema9,
          period
        );
      }
    }
    
    // Bollinger Bands (20 period, 2 standard deviations)
    if (activeIndicators.includes('bollinger')) {
      const period = 20;
      if (i >= period - 1 && processedBar.sma20) {
        const priceSlice = closingPrices.slice(i - (period - 1), i + 1);
        const bands = calculateBollingerBands(processedBar.sma20, priceSlice, period);
        
        processedBar.upperBand = bands.upper;
        processedBar.middleBand = bands.middle;
        processedBar.lowerBand = bands.lower;
      }
    }
    
    // RSI (period 14)
    if (activeIndicators.includes('rsi')) {
      const period = 14;
      if (i >= period) {
        const priceSlice = closingPrices.slice(0, i + 1);
        processedBar.rsi = calculateRSI(priceSlice, period);
      }
    }
    
    // MACD (12, 26, 9)
    if (activeIndicators.includes('macd')) {
      const fastPeriod = 12;
      const slowPeriod = 26;
      
      if (i >= Math.max(fastPeriod, slowPeriod) - 1) {
        const priceSlice = closingPrices.slice(0, i + 1);
        const macdResult = calculateMACD(priceSlice);
        
        if (macdResult) {
          processedBar.macd = macdResult.macd;
          processedBar.signal = macdResult.signal;
          processedBar.histogram = macdResult.histogram;
        }
      }
    }
    
    result.push(processedBar);
  }
  
  // Return in reverse order for displaying newest data first
  return result.reverse();
};
