
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from 'lucide-react';
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MovingAveragesProps {
  aboveSMA50: number;
  belowSMA50: number;
  aboveSMA200: number;
  belowSMA200: number;
  total: number;
}

export const MovingAverages: React.FC<MovingAveragesProps> = ({
  aboveSMA50,
  belowSMA50,
  aboveSMA200,
  belowSMA200,
  total
}) => {
  // Calculate percentages
  const aboveSMA50Percent = Math.round((aboveSMA50 / total) * 100);
  const aboveSMA200Percent = Math.round((aboveSMA200 / total) * 100);

  const sma50Data = [
    { name: 'Above SMA50', value: aboveSMA50, percent: aboveSMA50Percent },
    { name: 'Below SMA50', value: belowSMA50, percent: 100 - aboveSMA50Percent }
  ];

  const sma200Data = [
    { name: 'Above SMA200', value: aboveSMA200, percent: aboveSMA200Percent },
    { name: 'Below SMA200', value: belowSMA200, percent: 100 - aboveSMA200Percent }
  ];

  const COLORS = ['#22C55E', '#EF4444'];

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Stocks Above Moving Averages</CardTitle>
        <TooltipProvider>
          <UITooltip>
            <TooltipTrigger asChild>
              <Info className="h-5 w-5 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Shows the percentage of stocks trading above their 50-day and 200-day moving averages, key indicators of market health.</p>
            </TooltipContent>
          </UITooltip>
        </TooltipProvider>
      </CardHeader>
      <CardDescription className="px-6 text-base">
        <span className="font-medium">{aboveSMA50Percent}%</span> above SMA50 | <span className="font-medium">{aboveSMA200Percent}%</span> above SMA200
      </CardDescription>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-64">
          <div className="w-full h-full">
            <p className="text-center font-medium mb-2">50-Day Moving Average</p>
            <ResponsiveContainer width="100%" height="85%">
              <PieChart>
                <Pie
                  data={sma50Data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {sma50Data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [`${value} stocks (${name === 'Above SMA50' ? aboveSMA50Percent : 100 - aboveSMA50Percent}%)`, name]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="w-full h-full">
            <p className="text-center font-medium mb-2">200-Day Moving Average</p>
            <ResponsiveContainer width="100%" height="85%">
              <PieChart>
                <Pie
                  data={sma200Data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {sma200Data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [`${value} stocks (${name === 'Above SMA200' ? aboveSMA200Percent : 100 - aboveSMA200Percent}%)`, name]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MovingAverages;
