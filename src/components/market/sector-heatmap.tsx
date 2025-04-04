
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SectorPerformance } from "@/lib/api";
import { cn } from "@/lib/utils";
import PercentageChange from "@/components/ui/percentage-change";
import { useState } from "react";

interface SectorHeatmapProps {
  sectors: SectorPerformance[];
  className?: string;
}

const timeframes = ["1D", "1W", "1M", "3M", "6M", "1Y"] as const;
type Timeframe = typeof timeframes[number];

export function SectorHeatmap({ sectors, className }: SectorHeatmapProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>("1D");

  // Calculate color intensity based on performance
  const getBackgroundStyle = (performance: number) => {
    // For positive performance, use gain colors with intensity based on value
    if (performance > 0) {
      const intensity = Math.min(Math.abs(performance) / 2, 1) * 100;
      return {
        backgroundColor: `rgba(34, 197, 94, ${intensity / 100})`,
      };
    }
    
    // For negative performance, use loss colors with intensity based on value
    const intensity = Math.min(Math.abs(performance) / 2, 1) * 100;
    return {
      backgroundColor: `rgba(239, 68, 68, ${intensity / 100})`,
    };
  };
  
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <CardTitle className="text-lg font-semibold">Sector Rotation Heatmap</CardTitle>
            <CardDescription>Performance by market sector</CardDescription>
          </div>
          <div className="flex space-x-1">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={cn(
                  "px-2 py-1 text-xs font-medium rounded",
                  timeframe === tf 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {sectors.map((sector) => (
            <div 
              key={sector.sector}
              className="flex flex-col p-3 rounded-md border"
              style={getBackgroundStyle(sector.performance)}
            >
              <span className={cn(
                "font-medium",
                Math.abs(sector.performance) > 1.5 ? "text-white" : ""
              )}>
                {sector.sector}
              </span>
              <span className={cn(
                "text-lg font-semibold",
                Math.abs(sector.performance) > 1.5 ? "text-white" : ""
              )}>
                <PercentageChange 
                  value={sector.performance} 
                  showIcon={false}
                  className={Math.abs(sector.performance) > 1.5 ? "text-white" : ""}
                />
              </span>
              <span className={cn(
                "text-xs",
                Math.abs(sector.performance) > 1.5 ? "text-white/80" : "text-muted-foreground"
              )}>
                {sector.change > 0 ? '+' : ''}
                {sector.change.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default SectorHeatmap;
