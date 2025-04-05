import { useState } from "react";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { useApiData } from "@/hooks/use-api-data";
import { SectorPerformance } from "@/lib/api/types";
import SectorPerformanceComparison from "@/components/sectors/sector-performance-comparison";
import SectorIndustryBreakdown from "@/components/sectors/sector-industry-breakdown";
import SectorRotationHeatmap from "@/components/sectors/sector-rotation-heatmap";
import TimeframeSelector from "@/components/breadth/timeframe-selector";
import { SectorRelativeStrength } from "@/components/sectors/sector-relative-strength";
import { SectorCorrelationMatrix } from "@/components/sectors/sector-correlation-matrix";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const SectorsPage = () => {
  const isMobile = useIsMobile();
  const [timeframe, setTimeframe] = useState<string>("1M");
  
  const { data: sectorData, isLoading, error } = useApiData<{sectors: SectorPerformance[]}>(
    ['sectors', timeframe],
    '/v1/reference/sectors',
    { timeframe },
    {
      select: (data) => {
        if (data && data.sectors) return data;
        return {
          sectors: [
            { sector: "Technology", performance: 2.5, change: 8.75 },
            { sector: "Healthcare", performance: 0.8, change: 2.15 },
            { sector: "Financials", performance: -0.5, change: -1.25 },
            { sector: "Communication Services", performance: 1.2, change: 3.45 },
            { sector: "Consumer Discretionary", performance: 0.3, change: 0.85 },
            { sector: "Consumer Staples", performance: -0.2, change: -0.55 },
            { sector: "Energy", performance: -1.5, change: -4.25 },
            { sector: "Industrials", performance: 0.7, change: 1.95 },
            { sector: "Materials", performance: -0.6, change: -1.75 },
            { sector: "Real Estate", performance: -1.0, change: -2.85 },
            { sector: "Utilities", performance: -0.9, change: -2.45 }
          ]
        };
      }
    }
  );
  
  const handleTimeframeChange = (newTimeframe: string) => {
    setTimeframe(newTimeframe);
  };
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid gap-4 sm:gap-6">
          <Skeleton className="h-64" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
          </div>
        </div>
      );
    }
    
    if (error) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load sector data. Please try again later.
          </AlertDescription>
        </Alert>
      );
    }
    
    return (
      <div className="grid gap-4 sm:gap-6">
        <SectorRotationHeatmap sectors={sectorData?.sectors || []} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <SectorPerformanceComparison sectors={sectorData?.sectors || []} />
          <SectorRelativeStrength sectors={sectorData?.sectors || []} />
        </div>
        
        <SectorIndustryBreakdown activeSector={sectorData?.sectors[0]?.sector || ""} />
        
        <SectorCorrelationMatrix sectors={sectorData?.sectors || []} />
      </div>
    );
  };
  
  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Sector Analysis</h1>
            <p className="text-muted-foreground">
              Analyze market sectors, industry groups, and rotation patterns
            </p>
          </div>
          <TimeframeSelector 
            selectedTimeframe={timeframe}
            onTimeframeChange={handleTimeframeChange}
          />
        </div>
        
        {renderContent()}
      </div>
    </DashboardLayout>
  );
};

export default SectorsPage;
