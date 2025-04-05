
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SectorPerformance } from "@/lib/api/types";
import { cn } from "@/lib/utils";
import PercentageChange from "@/components/ui/percentage-change";

interface SectorRotationHeatmapProps {
  sectors: SectorPerformance[];
}

const timeframes = ["1D", "1W", "1M", "3M", "6M", "1Y"] as const;
type Timeframe = typeof timeframes[number];

export function SectorRotationHeatmap({ sectors }: SectorRotationHeatmapProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>("1M");
  
  // Generate mock data for different timeframes
  const getTimeframePerformance = (sector: string, timeframe: Timeframe): number => {
    // This would be replaced with real API data
    const basePerformance = sectors.find(s => s.sector === sector)?.performance || 0;
    
    switch(timeframe) {
      case "1D": return basePerformance * 0.2;
      case "1W": return basePerformance * 0.5;
      case "1M": return basePerformance;
      case "3M": return basePerformance * 2.2;
      case "6M": return basePerformance * 3.5;
      case "1Y": return basePerformance * 5;
      default: return basePerformance;
    }
  };
  
  // Calculate color intensity based on performance
  const getBackgroundStyle = (performance: number) => {
    if (performance > 0) {
      const intensity = Math.min(Math.abs(performance) / 2, 1);
      return {
        backgroundColor: `rgba(34, 197, 94, ${intensity})`,
      };
    }
    
    const intensity = Math.min(Math.abs(performance) / 2, 1);
    return {
      backgroundColor: `rgba(239, 68, 68, ${intensity})`,
    };
  };
  
  return (
    <Card>
      <CardHeader className="pb-2 sm:pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <CardTitle className="text-base sm:text-lg font-semibold">Sector Rotation Heatmap</CardTitle>
            <CardDescription>Multi-timeframe performance by market sector</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left font-medium text-muted-foreground">Sector</th>
                {timeframes.map((tf) => (
                  <th key={tf} className="px-4 py-2 text-center font-medium text-muted-foreground">{tf}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sectors.map((sector) => (
                <tr key={sector.sector} className="border-b">
                  <td className="px-4 py-2 font-medium">{sector.sector}</td>
                  {timeframes.map((tf) => {
                    const performance = getTimeframePerformance(sector.sector, tf);
                    return (
                      <td 
                        key={tf} 
                        className={cn("px-4 py-2 text-center", 
                          Math.abs(performance) > 1.5 ? "text-white" : ""
                        )} 
                        style={getBackgroundStyle(performance)}
                      >
                        <PercentageChange 
                          value={performance} 
                          showIcon={false} 
                          className={Math.abs(performance) > 1.5 ? "text-white" : ""}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export default SectorRotationHeatmap;
