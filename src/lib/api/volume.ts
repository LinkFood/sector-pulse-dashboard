
import { makeRequest } from './client';

// Define types for volume profile data
export interface AggregateBar {
  o: number; // open price
  h: number; // high price
  l: number; // low price
  c: number; // close price
  v: number; // volume
  t: number; // timestamp
}

export interface AggregatesResponse {
  ticker: string;
  status: string;
  queryCount: number;
  resultsCount: number;
  adjusted: boolean;
  results: AggregateBar[];
}

// Function to get the timestamp for a given period ago
const getTimestampForPeriod = (period: string): number => {
  const now = new Date();
  switch (period) {
    case '1D':
      // 1 day ago
      return new Date(now.setDate(now.getDate() - 1)).getTime();
    case '1W':
      // 1 week ago
      return new Date(now.setDate(now.getDate() - 7)).getTime();
    case '1M':
      // 1 month ago
      return new Date(now.setMonth(now.getMonth() - 1)).getTime();
    case '3M':
      // 3 months ago
      return new Date(now.setMonth(now.getMonth() - 3)).getTime();
    case '6M':
      // 6 months ago
      return new Date(now.setMonth(now.getMonth() - 6)).getTime();
    case '1Y':
      // 1 year ago
      return new Date(now.setFullYear(now.getFullYear() - 1)).getTime();
    default:
      // Default to 1 month
      return new Date(now.setMonth(now.getMonth() - 1)).getTime();
  }
};

// Get multiplier and timespan based on period
const getMultiplierAndTimespan = (period: string): { multiplier: number, timespan: string } => {
  switch (period) {
    case '1D':
      return { multiplier: 5, timespan: 'minute' };
    case '1W':
      return { multiplier: 30, timespan: 'minute' };
    case '1M':
      return { multiplier: 1, timespan: 'hour' };
    case '3M':
      return { multiplier: 4, timespan: 'hour' };
    case '6M':
      return { multiplier: 1, timespan: 'day' };
    case '1Y':
      return { multiplier: 1, timespan: 'day' };
    default:
      return { multiplier: 1, timespan: 'day' };
  }
};

// Fetch aggregate data for a stock over a specific period
export const fetchAggregateData = async (
  symbol: string, 
  period: string = '1M'
): Promise<AggregatesResponse> => {
  console.log(`Fetching aggregate data for ${symbol} over ${period}`);
  
  const { multiplier, timespan } = getMultiplierAndTimespan(period);
  const fromTimestamp = getTimestampForPeriod(period);
  const toTimestamp = new Date().getTime();
  
  // Format dates to YYYY-MM-DD format for API
  const fromDate = new Date(fromTimestamp).toISOString().split('T')[0];
  const toDate = new Date(toTimestamp).toISOString().split('T')[0];

  const url = `/v2/aggs/ticker/${symbol}/range/${multiplier}/${timespan}/${fromDate}/${toDate}`;
  
  console.log('API Request URL:', url);
  
  return makeRequest<AggregatesResponse>(url);
};

// Process the data to generate volume profile
export const generateVolumeProfile = (data: AggregateBar[], priceSteps: number = 20): { price: number, volume: number }[] => {
  if (!data || data.length === 0) {
    return [];
  }

  // Find min and max prices
  let minPrice = Math.min(...data.map(bar => bar.l));
  let maxPrice = Math.max(...data.map(bar => bar.h));
  
  // Add a small buffer
  const buffer = (maxPrice - minPrice) * 0.05;
  minPrice -= buffer;
  maxPrice += buffer;
  
  // Calculate price range per step
  const priceRange = maxPrice - minPrice;
  const stepSize = priceRange / priceSteps;
  
  // Initialize price levels array
  const priceLevels = Array.from({ length: priceSteps }, (_, i) => ({
    price: minPrice + stepSize * (i + 0.5), // Center of the price level
    volume: 0
  }));
  
  // Distribute volume across price levels
  data.forEach(bar => {
    // For each bar, we distribute its volume across the price range it spans
    const lowIndex = Math.max(0, Math.floor((bar.l - minPrice) / stepSize));
    const highIndex = Math.min(priceSteps - 1, Math.floor((bar.h - minPrice) / stepSize));
    
    // Simple distribution: divide volume equally across the price levels it spans
    const volumePerLevel = bar.v / (highIndex - lowIndex + 1);
    
    for (let i = lowIndex; i <= highIndex; i++) {
      if (i >= 0 && i < priceLevels.length) {
        priceLevels[i].volume += volumePerLevel;
      }
    }
  });
  
  return priceLevels;
};

// Find significant price levels (support/resistance) based on volume clusters
export const findSignificantLevels = (
  volumeProfile: { price: number, volume: number }[], 
  threshold: number = 0.7
): number[] => {
  if (!volumeProfile || volumeProfile.length === 0) {
    return [];
  }
  
  // Find the maximum volume
  const maxVolume = Math.max(...volumeProfile.map(level => level.volume));
  const thresholdVolume = maxVolume * threshold;
  
  // Find price levels with volume above threshold
  const significantLevels = volumeProfile
    .filter(level => level.volume > thresholdVolume)
    .map(level => level.price);
    
  return significantLevels;
};
