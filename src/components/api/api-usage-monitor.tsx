
import React from 'react';
import { useApiUsage } from '@/hooks/use-api-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Gauge, RefreshCw, Ban } from 'lucide-react';
import { cn } from '@/lib/utils';

const ApiUsageMonitor: React.FC = () => {
  const { usageStats, resetUsageStats } = useApiUsage();

  const dailyUsagePercentage = Math.min(Math.round((usageStats.dailyRequests / 100) * 100), 100);

  // Sort endpoints by usage count (descending)
  const sortedEndpoints = Object.entries(usageStats.requestsByEndpoint || {})
    .sort(([, countA], [, countB]) => (countB as number) - (countA as number))
    .slice(0, 5); // Only show top 5

  // Determine usage level for styling
  const usageLevel = 
    dailyUsagePercentage < 50 ? 'low' : 
    dailyUsagePercentage < 80 ? 'medium' : 'high';

  const usageLevelColorClass = {
    low: 'text-green-500',
    medium: 'text-amber-500',
    high: 'text-red-500',
  }[usageLevel];

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Gauge className="h-4 w-4" />
              API Usage Monitor
            </CardTitle>
            <CardDescription>
              {usageStats.lastResetDate ? 
                `Statistics since ${new Date(usageStats.lastResetDate).toLocaleDateString()}` : 
                'Tracking API usage statistics'}
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={resetUsageStats} 
            title="Reset usage statistics"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Daily API Usage</span>
              <span className={cn("font-medium", usageLevelColorClass)}>
                {usageStats.dailyRequests}/100 requests
              </span>
            </div>
            <Progress 
              value={dailyUsagePercentage} 
              className={cn(
                "h-2", 
                dailyUsagePercentage >= 80 ? "bg-red-100" : "bg-slate-100"
              )}
            />
          </div>

          {dailyUsagePercentage >= 80 && (
            <div className="bg-red-50 text-red-600 p-2 rounded-md flex items-center text-sm">
              <Ban className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>Approaching daily limit. Consider implementing additional throttling.</span>
            </div>
          )}

          {sortedEndpoints.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Most Used Endpoints</h4>
              <ul className="space-y-1">
                {sortedEndpoints.map(([endpoint, count]) => (
                  <li key={endpoint} className="text-sm flex justify-between">
                    <span className="truncate max-w-[70%] text-muted-foreground">{endpoint}</span>
                    <span className="font-medium">{count} requests</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiUsageMonitor;
