
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import DashboardLayout from "@/layouts/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchAggregateData, generateVolumeProfile, findSignificantLevels, AggregateBar } from "@/lib/api/volume";
import VolumeProfileChart from "@/components/market/volume-profile-chart";
import CandlestickChart from "@/components/market/candlestick-chart";
import StockSymbolSearch from "@/components/market/stock-symbol-search";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const timeframes = ['1D', '1W', '1M', '3M', '6M', '1Y'] as const;
type Timeframe = typeof timeframes[number];

const VolumePage = () => {
  const [symbol, setSymbol] = useState<string>('AAPL');
  const [timeframe, setTimeframe] = useState<Timeframe>('1M');
  const [volumeProfile, setVolumeProfile] = useState<{ price: number, volume: number }[]>([]);
  const [significantLevels, setSignificantLevels] = useState<number[]>([]);

  // Fetch aggregate data
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['aggregateData', symbol, timeframe],
    queryFn: () => fetchAggregateData(symbol, timeframe),
    enabled: !!symbol,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Calculate volume profile when data changes
  useEffect(() => {
    if (data?.results && data.results.length > 0) {
      console.log(`Processing ${data.results.length} data points for ${symbol}`);
      
      // Generate volume profile
      const profile = generateVolumeProfile(data.results);
      setVolumeProfile(profile);
      
      // Find significant price levels
      const levels = findSignificantLevels(profile);
      setSignificantLevels(levels);
      
      console.log(`Found ${levels.length} significant price levels`);
    }
  }, [data, symbol]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(`Error loading data: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('Volume Profile Error:', error);
    }
  }, [error]);

  const handleSymbolSearch = (newSymbol: string) => {
    setSymbol(newSymbol);
  };

  const handleTimeframeChange = (newTimeframe: Timeframe) => {
    setTimeframe(newTimeframe);
  };

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <Card>
          <CardHeader className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <CardTitle className="text-xl">Volume Profile Analysis</CardTitle>
              <CardDescription>
                Analyze trading volume patterns at key price levels
              </CardDescription>
            </div>
            <StockSymbolSearch onSearch={handleSymbolSearch} isLoading={isLoading} />
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex flex-wrap gap-2">
              {timeframes.map((tf) => (
                <button
                  key={tf}
                  onClick={() => handleTimeframeChange(tf)}
                  className={cn(
                    "px-3 py-1 text-sm font-medium rounded-md transition-colors",
                    timeframe === tf
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  )}
                >
                  {tf}
                </button>
              ))}
            </div>

            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-[500px] w-full" />
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-[500px] bg-destructive/10 text-destructive rounded-md">
                <p>Error loading volume profile data. Please try again.</p>
              </div>
            ) : data?.results && data.results.length > 0 ? (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Price Chart (Candlesticks) */}
                <div className="xl:col-span-2">
                  <h3 className="font-medium mb-2">Price History: {symbol}</h3>
                  <CandlestickChart
                    data={data.results}
                    significantLevels={significantLevels}
                  />
                </div>

                {/* Volume Profile */}
                <div>
                  <h3 className="font-medium mb-2">Volume Profile</h3>
                  <VolumeProfileChart
                    data={volumeProfile}
                    significantLevels={significantLevels}
                  />
                  
                  {/* Key Levels Section */}
                  <div className="mt-6">
                    <h3 className="font-medium mb-2">Key Support/Resistance Levels</h3>
                    {significantLevels.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {significantLevels.map((level, i) => (
                          <div 
                            key={`sig-level-${i}`}
                            className="bg-secondary/50 p-3 rounded-md text-center"
                          >
                            <span className="font-mono">${level.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">
                        No significant volume levels detected
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[500px] bg-muted rounded-md">
                <p>No data available for {symbol}. Try a different symbol or timeframe.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default VolumePage;
