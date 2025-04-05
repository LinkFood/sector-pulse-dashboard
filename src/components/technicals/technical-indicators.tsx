
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useApiData } from "@/hooks/use-api-data";
import { processBarsWithIndicators } from "@/lib/technicals/indicators";
import { optimizeDataSet, getOptimizationLevel } from "@/lib/technicals/optimizer";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import IndicatorSelector from "@/components/technicals/indicator-selector";

// Import types from the correct location
interface AggregateBar {
  v: number;  // Volume
  o: number;  // Open price
  c: number;  // Close price
  h: number;  // High price
  l: number;  // Low price
  t: number;  // Timestamp
}

interface ProcessedBar extends AggregateBar {
  sma20?: number;
  ema9?: number;
  upperBand?: number;
  lowerBand?: number;
  rsi?: number;
  macd?: number;
  signal?: number;
  histogram?: number;
  [key: string]: number | undefined;
}

interface TechnicalIndicatorsProps {
  symbol: string;
  period: string;
  onDataProcessed?: (data: ProcessedBar[]) => void;
}

export function TechnicalIndicators({ 
  symbol, 
  period, 
  onDataProcessed 
}: TechnicalIndicatorsProps) {
  const [activeIndicators, setActiveIndicators] = useState<string[]>(["sma", "ema"]);
  
  // Use the enhanced API data hook for better caching and offline support
  const { data, isLoading, error } = useApiData<{results: AggregateBar[]}>(
    ['technicals', symbol, period],
    `/v2/aggs/ticker/${symbol}/range`,
    { ticker: symbol, period },
    {
      enabled: !!symbol,
      // Use the data processing function to select only what we need
      select: (response) => {
        if (!response?.results) return [];
        
        // Optimize data set for performance
        const optimizationLevel = getOptimizationLevel(response.results);
        const optimizedData = optimizeDataSet(response.results, optimizationLevel);
        
        // Process with indicators
        const indicators = {
          sma: activeIndicators.includes("sma"),
          ema: activeIndicators.includes("ema"),
          bollinger: activeIndicators.includes("bollinger"),
          rsi: activeIndicators.includes("rsi"),
          macd: activeIndicators.includes("macd"),
        };
        
        const processedData = processBarsWithIndicators(optimizedData, indicators);
        
        // Call the callback with processed data
        if (onDataProcessed) {
          onDataProcessed(processedData);
        }
        
        return processedData;
      }
    }
  );
  
  const handleToggleIndicator = (indicator: string) => {
    setActiveIndicators(prev => {
      if (prev.includes(indicator)) {
        return prev.filter(i => i !== indicator);
      } else {
        return [...prev, indicator];
      }
    });
  };
  
  if (isLoading) {
    return <Skeleton className="h-8" />;
  }
  
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load technical indicators. Using cached data if available.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="flex justify-end mb-4">
      <IndicatorSelector 
        activeIndicators={activeIndicators}
        onToggle={handleToggleIndicator}
      />
    </div>
  );
}

export default TechnicalIndicators;
