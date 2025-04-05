
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { fetchMarketBreadthData, fetchBreadthOscillatorData, MarketSegment } from "@/lib/api/breadth";
import AdvancingDeclining from "@/components/breadth/advancing-declining";
import MovingAverages from "@/components/breadth/moving-averages";
import BreadthOscillator from "@/components/breadth/breadth-oscillator";
import HighsLows from "@/components/breadth/highs-lows";
import TimeframeSelector from "@/components/breadth/timeframe-selector";
import SegmentSelector from "@/components/breadth/segment-selector";

const BreadthPage = () => {
  const [timeframe, setTimeframe] = useState<string>("1D");
  const [segment, setSegment] = useState<MarketSegment>(MarketSegment.ALL);

  // Fetch market breadth data
  const { data: breadthData, isLoading: isLoadingBreadth, error: breadthError } = useQuery({
    queryKey: ["marketBreadth", timeframe, segment],
    queryFn: () => fetchMarketBreadthData(timeframe, segment),
  });

  // Fetch oscillator data
  const { data: oscillatorData, isLoading: isLoadingOscillator, error: oscillatorError } = useQuery({
    queryKey: ["breadthOscillator", timeframe],
    queryFn: () => fetchBreadthOscillatorData(timeframe),
  });

  // Handle loading and error states
  const isLoading = isLoadingBreadth || isLoadingOscillator;
  const hasError = breadthError || oscillatorError;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      );
    }

    if (hasError) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load market breadth data. Please try again later.
          </AlertDescription>
        </Alert>
      );
    }

    if (breadthData && oscillatorData) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AdvancingDeclining 
            advancing={breadthData.advancing}
            declining={breadthData.declining}
            unchanged={breadthData.unchanged}
            total={breadthData.total}
          />
          
          <MovingAverages 
            aboveSMA50={breadthData.aboveSMA50}
            belowSMA50={breadthData.total - breadthData.aboveSMA50}
            aboveSMA200={breadthData.aboveSMA200}
            belowSMA200={breadthData.total - breadthData.aboveSMA200}
            total={breadthData.total}
          />
          
          <BreadthOscillator 
            data={oscillatorData}
            timeframe={timeframe}
          />
          
          <HighsLows 
            newHighs={breadthData.newHighs}
            newLows={breadthData.newLows}
            total={breadthData.total}
          />
        </div>
      );
    }

    return null;
  };

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Market Breadth Dashboard</CardTitle>
            <CardDescription>
              View advanced indicators of overall market health
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Timeframe</h3>
                  <TimeframeSelector
                    selectedTimeframe={timeframe}
                    onTimeframeChange={setTimeframe}
                  />
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Market Segment</h3>
                  <SegmentSelector
                    selectedSegment={segment}
                    onSegmentChange={setSegment}
                  />
                </div>
              </div>

              <Separator className="my-2" />

              {renderContent()}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default BreadthPage;
