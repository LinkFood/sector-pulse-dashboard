
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Database, RefreshCw, Trash2 } from "lucide-react";
import { useApiUsage } from "@/hooks/use-api-data";
import { clearCache } from "@/lib/api/cache";

export function ApiUsageMonitor() {
  const { usageStats, resetUsageStats } = useApiUsage();
  const [isOpen, setIsOpen] = useState(false);
  
  // Calculate usage percentage (based on 100 requests per day on starter plan)
  const usagePercentage = Math.min(100, (usageStats.dailyRequests / 100) * 100);
  const isHighUsage = usagePercentage > 80;
  
  const handleClearCache = () => {
    clearCache();
  };
  
  if (!isOpen) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        className="fixed bottom-4 right-4 z-50"
        onClick={() => setIsOpen(true)}
      >
        <Database className="w-4 h-4 mr-2" />
        API: {usageStats.dailyRequests}/100
      </Button>
    );
  }
  
  return (
    <Card className="fixed bottom-4 right-4 z-50 w-80 shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-md">Polygon.io API Usage</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            ×
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Daily API Requests</span>
            <span className="text-sm font-semibold">
              {usageStats.dailyRequests}/100
            </span>
          </div>
          
          <Progress 
            value={usagePercentage} 
            className={isHighUsage ? "bg-red-200" : ""}
            indicatorClassName={isHighUsage ? "bg-red-500" : ""}
          />
          
          <div className="text-xs text-muted-foreground">
            Reset: {usageStats.lastResetDate || 'Today'}
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-1 max-h-40 overflow-y-auto">
          <div className="text-sm font-medium mb-1">Requests by Endpoint</div>
          {Object.entries(usageStats.requestsByEndpoint || {}).map(([endpoint, count]) => (
            <div key={endpoint} className="flex justify-between text-xs">
              <span className="truncate w-52">{endpoint}</span>
              <span>{count}</span>
            </div>
          ))}
        </div>
        
        <div className="flex space-x-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={resetUsageStats}>
            <RefreshCw className="w-3 h-3 mr-1" />
            Reset Stats
          </Button>
          <Button variant="outline" size="sm" className="flex-1" onClick={handleClearCache}>
            <Trash2 className="w-3 h-3 mr-1" />
            Clear Cache
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default ApiUsageMonitor;
