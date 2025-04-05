
import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine 
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from 'lucide-react';
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BreadthOscillatorData } from '@/lib/api/breadth';

interface BreadthOscillatorProps {
  data: BreadthOscillatorData[];
  timeframe: string;
}

export const BreadthOscillator: React.FC<BreadthOscillatorProps> = ({
  data,
  timeframe
}) => {
  // Get current momentum
  const currentValue = data.length > 0 ? data[data.length - 1].value : 0;
  const isPositive = currentValue > 0;
  
  // Create momentum message based on value
  let momentumMessage = 'Neutral';
  let momentumColor = 'text-yellow-500';
  
  if (currentValue > 50) {
    momentumMessage = 'Strong Bullish';
    momentumColor = 'text-green-500';
  } else if (currentValue > 0) {
    momentumMessage = 'Bullish';
    momentumColor = 'text-green-400';
  } else if (currentValue < -50) {
    momentumMessage = 'Strong Bearish';
    momentumColor = 'text-red-500';
  } else if (currentValue < 0) {
    momentumMessage = 'Bearish';
    momentumColor = 'text-red-400';
  }
  
  // Format date label based on timeframe
  const formatXAxis = (tickItem: string) => {
    const date = new Date(tickItem);
    if (timeframe === '1D' || timeframe === '1W') {
      return date.toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' });
    } else if (timeframe === '1M' || timeframe === '3M') {
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } else {
      return date.toLocaleDateString(undefined, { month: 'short', year: '2-digit' });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Market Breadth Oscillator</CardTitle>
        <TooltipProvider>
          <UITooltip>
            <TooltipTrigger asChild>
              <Info className="h-5 w-5 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Shows market momentum as an oscillator between -100 and +100. Values above 0 indicate bullish momentum, while values below 0 indicate bearish momentum.</p>
            </TooltipContent>
          </UITooltip>
        </TooltipProvider>
      </CardHeader>
      <CardDescription className="px-6 text-base">
        Current momentum: <span className={`font-medium ${momentumColor}`}>{momentumMessage}</span> ({currentValue.toFixed(1)})
      </CardDescription>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatXAxis}
                interval="preserveStartEnd"
                minTickGap={30}
              />
              <YAxis domain={[-100, 100]} />
              <Tooltip
                formatter={(value) => [`${value}`, 'Oscillator Value']}
                labelFormatter={(label) => new Date(label).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
              />
              <ReferenceLine y={50} stroke="green" strokeDasharray="3 3" />
              <ReferenceLine y={0} stroke="#666" />
              <ReferenceLine y={-50} stroke="red" strokeDasharray="3 3" />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#8B5CF6" 
                dot={false}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default BreadthOscillator;
