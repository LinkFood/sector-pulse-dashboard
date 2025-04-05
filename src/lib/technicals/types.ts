
import { AggregateBar } from "../api/volume";

// Extended bar with technical indicators
export interface ProcessedBar extends AggregateBar {
  // Moving Averages
  sma20?: number;
  ema9?: number;
  
  // Bollinger Bands
  upperBand?: number;
  middleBand?: number;
  lowerBand?: number;
  
  // Oscillators
  rsi?: number;
  macd?: number;
  signal?: number;
  histogram?: number;
  
  // Formatted data for display
  formattedDate?: string;
}
