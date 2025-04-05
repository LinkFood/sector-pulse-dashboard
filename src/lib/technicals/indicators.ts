
import { ProcessedBar } from "./types";

// Default parameter values
const DEFAULT_PARAMS = {
  SMA_PERIOD: 20,
  EMA_PERIOD: 9,
  BOLLINGER_PERIOD: 20,
  BOLLINGER_STD_DEV: 2,
  RSI_PERIOD: 14,
  MACD_FAST_PERIOD: 12,
  MACD_SLOW_PERIOD: 26,
  MACD_SIGNAL_PERIOD: 9,
};

// Calculate Simple Moving Average (SMA)
export const calculateSMA = (
  data: ProcessedBar[], 
  period: number = DEFAULT_PARAMS.SMA_PERIOD,
  field: keyof ProcessedBar = 'c'
): number[] => {
  const result: number[] = [];
  
  if (!data || data.length < period) {
    return new Array(data?.length || 0).fill(null);
  }
  
  let sum = 0;
  
  // Calculate initial sum
  for (let i = 0; i < period; i++) {
    sum += data[i][field] as number;
  }
  
  // Calculate initial SMA
  result.push(sum / period);
  
  // Calculate subsequent SMAs using previous sum
  for (let i = period; i < data.length; i++) {
    sum = sum - (data[i - period][field] as number) + (data[i][field] as number);
    result.push(sum / period);
  }
  
  // Pad the beginning with undefined values
  return [...new Array(period - 1).fill(null), ...result];
};

// Calculate Exponential Moving Average (EMA)
export const calculateEMA = (
  data: ProcessedBar[], 
  period: number = DEFAULT_PARAMS.EMA_PERIOD,
  field: keyof ProcessedBar = 'c'
): number[] => {
  const result: number[] = [];
  
  if (!data || data.length < period) {
    return new Array(data?.length || 0).fill(null);
  }
  
  // Calculate SMA as first EMA value
  const sma = calculateSMA(data.slice(0, period), period, field)[period - 1];
  result.push(sma as number);
  
  // Multiplier: (2 / (period + 1))
  const multiplier = 2 / (period + 1);
  
  // Calculate EMA
  for (let i = period; i < data.length; i++) {
    const ema = ((data[i][field] as number) - result[result.length - 1]) * multiplier + result[result.length - 1];
    result.push(ema);
  }
  
  // Pad the beginning with undefined values
  return [...new Array(period - 1).fill(null), ...result];
};

// Calculate Bollinger Bands
export const calculateBollingerBands = (
  data: ProcessedBar[],
  period: number = DEFAULT_PARAMS.BOLLINGER_PERIOD,
  stdDev: number = DEFAULT_PARAMS.BOLLINGER_STD_DEV,
  field: keyof ProcessedBar = 'c'
): { upper: number[], middle: number[], lower: number[] } => {
  if (!data || data.length < period) {
    return {
      upper: new Array(data?.length || 0).fill(null),
      middle: new Array(data?.length || 0).fill(null),
      lower: new Array(data?.length || 0).fill(null)
    };
  }
  
  const middle = calculateSMA(data, period, field);
  const upper: number[] = [];
  const lower: number[] = [];
  
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      upper.push(null as unknown as number);
      lower.push(null as unknown as number);
      continue;
    }
    
    // Calculate standard deviation
    let sum = 0;
    for (let j = i - period + 1; j <= i; j++) {
      sum += Math.pow((data[j][field] as number) - (middle[i] as number), 2);
    }
    const standardDeviation = Math.sqrt(sum / period);
    
    upper.push((middle[i] as number) + stdDev * standardDeviation);
    lower.push((middle[i] as number) - stdDev * standardDeviation);
  }
  
  return { upper, middle, lower };
};

// Calculate RSI (Relative Strength Index)
export const calculateRSI = (
  data: ProcessedBar[], 
  period: number = DEFAULT_PARAMS.RSI_PERIOD
): number[] => {
  if (!data || data.length <= period) {
    return new Array(data?.length || 0).fill(null);
  }
  
  const result: number[] = [];
  let gains = 0;
  let losses = 0;
  
  // Calculate initial average gain/loss
  for (let i = 1; i <= period; i++) {
    const change = data[i].c - data[i - 1].c;
    if (change >= 0) {
      gains += change;
    } else {
      losses += Math.abs(change);
    }
  }
  
  // Initial RS value
  let avgGain = gains / period;
  let avgLoss = losses / period;
  let rs = avgGain / avgLoss;
  let rsi = 100 - (100 / (1 + rs));
  
  result.push(rsi);
  
  // Calculate subsequent RSI values
  for (let i = period + 1; i < data.length; i++) {
    const change = data[i].c - data[i - 1].c;
    let currentGain = 0;
    let currentLoss = 0;
    
    if (change >= 0) {
      currentGain = change;
    } else {
      currentLoss = Math.abs(change);
    }
    
    // Use smoothed moving average
    avgGain = ((avgGain * (period - 1)) + currentGain) / period;
    avgLoss = ((avgLoss * (period - 1)) + currentLoss) / period;
    
    if (avgLoss === 0) {
      rsi = 100;
    } else {
      rs = avgGain / avgLoss;
      rsi = 100 - (100 / (1 + rs));
    }
    
    result.push(rsi);
  }
  
  // Pad the beginning with null values
  return [...new Array(period).fill(null), ...result];
};

// Calculate MACD (Moving Average Convergence Divergence)
export const calculateMACD = (
  data: ProcessedBar[], 
  fastPeriod: number = DEFAULT_PARAMS.MACD_FAST_PERIOD,
  slowPeriod: number = DEFAULT_PARAMS.MACD_SLOW_PERIOD,
  signalPeriod: number = DEFAULT_PARAMS.MACD_SIGNAL_PERIOD
): { macd: number[], signal: number[], histogram: number[] } => {
  if (!data || data.length <= slowPeriod) {
    return {
      macd: new Array(data?.length || 0).fill(null),
      signal: new Array(data?.length || 0).fill(null),
      histogram: new Array(data?.length || 0).fill(null)
    };
  }
  
  // Calculate EMAs
  const fastEMA = calculateEMA(data, fastPeriod, 'c');
  const slowEMA = calculateEMA(data, slowPeriod, 'c');
  
  // Calculate MACD line (fast EMA - slow EMA)
  const macdLine: number[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < slowPeriod - 1) {
      macdLine.push(null as unknown as number);
    } else {
      macdLine.push((fastEMA[i] as number) - (slowEMA[i] as number));
    }
  }
  
  // Calculate signal line (EMA of MACD line)
  let macdData = [];
  for (let i = 0; i < macdLine.length; i++) {
    if (macdLine[i] !== null) {
      macdData.push({ c: macdLine[i], h: 0, l: 0, o: 0, v: 0, t: 0 });
    } else {
      macdData.push({ c: 0, h: 0, l: 0, o: 0, v: 0, t: 0 });
    }
  }
  
  const signalLine = calculateEMA(macdData, signalPeriod, 'c');
  
  // Calculate histogram (MACD line - signal line)
  const histogram: number[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < slowPeriod + signalPeriod - 2) {
      histogram.push(null as unknown as number);
    } else {
      histogram.push((macdLine[i] as number) - (signalLine[i] as number));
    }
  }
  
  return {
    macd: macdLine,
    signal: signalLine,
    histogram: histogram
  };
};

// Process raw price data into technical indicators
export const processBarsWithIndicators = (
  bars: ProcessedBar[],
  indicators: {
    sma?: boolean;
    ema?: boolean;
    bollinger?: boolean;
    rsi?: boolean;
    macd?: boolean;
  } = {
    sma: true,
    ema: true,
    bollinger: true,
    rsi: true,
    macd: true
  }
): ProcessedBar[] => {
  if (!bars || bars.length === 0) return [];
  
  // Create a copy of the bars to modify
  const processedBars = [...bars];
  
  // Format dates
  processedBars.forEach((bar) => {
    bar.formattedDate = new Date(bar.t).toLocaleDateString();
  });
  
  // Calculate SMA
  if (indicators.sma) {
    const smaValues = calculateSMA(bars, DEFAULT_PARAMS.SMA_PERIOD, 'c');
    processedBars.forEach((bar, i) => {
      bar.sma20 = smaValues[i];
    });
  }
  
  // Calculate EMA
  if (indicators.ema) {
    const emaValues = calculateEMA(bars, DEFAULT_PARAMS.EMA_PERIOD, 'c');
    processedBars.forEach((bar, i) => {
      bar.ema9 = emaValues[i];
    });
  }
  
  // Calculate Bollinger Bands
  if (indicators.bollinger) {
    const bands = calculateBollingerBands(bars, DEFAULT_PARAMS.BOLLINGER_PERIOD, DEFAULT_PARAMS.BOLLINGER_STD_DEV, 'c');
    processedBars.forEach((bar, i) => {
      bar.upperBand = bands.upper[i];
      bar.middleBand = bands.middle[i];
      bar.lowerBand = bands.lower[i];
    });
  }
  
  // Calculate RSI
  if (indicators.rsi) {
    const rsiValues = calculateRSI(bars, DEFAULT_PARAMS.RSI_PERIOD);
    processedBars.forEach((bar, i) => {
      bar.rsi = rsiValues[i];
    });
  }
  
  // Calculate MACD
  if (indicators.macd) {
    const macd = calculateMACD(
      bars,
      DEFAULT_PARAMS.MACD_FAST_PERIOD,
      DEFAULT_PARAMS.MACD_SLOW_PERIOD,
      DEFAULT_PARAMS.MACD_SIGNAL_PERIOD
    );
    
    processedBars.forEach((bar, i) => {
      bar.macd = macd.macd[i];
      bar.signal = macd.signal[i];
      bar.histogram = macd.histogram[i];
    });
  }
  
  return processedBars;
};
