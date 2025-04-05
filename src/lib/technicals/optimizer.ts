
import { ProcessedBar } from "./types";

// Optimize data array by reducing the number of data points for better performance
export const optimizeDataSet = (
  data: ProcessedBar[],
  maxDataPoints: number = 500
): ProcessedBar[] => {
  if (!data || data.length <= maxDataPoints) {
    return data;
  }
  
  // Calculate step size to reduce data points
  const step = Math.ceil(data.length / maxDataPoints);
  
  // Filter data points based on step
  const optimizedData: ProcessedBar[] = [];
  
  for (let i = 0; i < data.length; i += step) {
    optimizedData.push(data[i]);
  }
  
  // Ensure we include the last data point for continuity
  if (optimizedData[optimizedData.length - 1] !== data[data.length - 1]) {
    optimizedData.push(data[data.length - 1]);
  }
  
  return optimizedData;
};

// Compress data for efficient storage
export const compressData = (data: ProcessedBar[]): string => {
  // Basic implementation: Convert to JSON string
  // In a production app, you might use a more efficient compression algorithm
  return JSON.stringify(data);
};

// Decompress data for usage
export const decompressData = (compressed: string): ProcessedBar[] => {
  try {
    return JSON.parse(compressed) as ProcessedBar[];
  } catch (e) {
    console.error('Failed to decompress data:', e);
    return [];
  }
};

// Calculate data size in KB
export const calculateDataSize = (data: any): number => {
  const jsonString = JSON.stringify(data);
  return jsonString.length / 1024;
};

// Get appropriate optimization level based on data size
export const getOptimizationLevel = (data: ProcessedBar[]): number => {
  const size = calculateDataSize(data);
  
  if (size > 1000) {
    // Very large dataset (>1MB): Aggressive optimization
    return 250;
  } else if (size > 500) {
    // Large dataset: Medium optimization
    return 500;
  } else if (size > 200) {
    // Medium dataset: Light optimization
    return 1000;
  }
  
  // Small dataset: No optimization needed
  return data.length;
};
