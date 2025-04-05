
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoCircle } from 'lucide-react';
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HighsLowsProps {
  newHighs: number;
  newLows: number;
  total: number;
}

export const HighsLows: React.FC<HighsLowsProps> = ({
  newHighs,
  newLows,
  total
}) => {
  // Calculate percentages
  const highsPercent = Math.round((newHighs / total) * 100);
  const lowsPercent = Math.round((newLows / total) * 100);

  const data = [
    { name: 'New 52-Week Highs', value: newHighs, percent: highsPercent },
    { name: 'New 52-Week Lows', value: newLows, percent: lowsPercent }
  ];

  // Determine market conditions
  let marketCondition = 'Neutral';
  let marketColor = 'text-yellow-500';
  
  if (newHighs > newLows * 3) {
    marketCondition = 'Strong Bullish';
    marketColor = 'text-green-500';
  } else if (newHighs > newLows) {
    marketCondition = 'Bullish';
    marketColor = 'text-green-400';
  } else if (newLows > newHighs * 3) {
    marketCondition = 'Strong Bearish';
    marketColor = 'text-red-500';
  } else if (newLows > newHighs) {
    marketCondition = 'Bearish';
    marketColor = 'text-red-400';
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">New Highs vs New Lows</CardTitle>
        <TooltipProvider>
          <UITooltip>
            <TooltipTrigger asChild>
              <InfoCircle className="h-5 w-5 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Shows the number of stocks making new 52-week highs versus new 52-week lows, a key indicator of market strength or weakness.</p>
            </TooltipContent>
          </UITooltip>
        </TooltipProvider>
      </CardHeader>
      <CardDescription className="px-6 text-base">
        Market condition: <span className={`font-medium ${marketColor}`}>{marketCondition}</span>
      </CardDescription>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip
                formatter={(value, name, props) => [`${value} stocks (${props.payload.percent}%)`, props.payload.name]}
              />
              <Bar 
                dataKey="value" 
                fill={(entry) => entry.name === 'New 52-Week Highs' ? '#22C55E' : '#EF4444'} 
                barSize={30}
                label={{ position: 'right', formatter: (value) => `${value}` }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default HighsLows;
