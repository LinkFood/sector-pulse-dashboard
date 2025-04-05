
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

interface AdvancingDecliningProps {
  advancing: number;
  declining: number;
  unchanged: number;
  total: number;
}

export const AdvancingDeclining: React.FC<AdvancingDecliningProps> = ({
  advancing,
  declining,
  unchanged,
  total
}) => {
  // Calculate percentages
  const advancingPercent = Math.round((advancing / total) * 100);
  const decliningPercent = Math.round((declining / total) * 100);
  const unchangedPercent = Math.round((unchanged / total) * 100);

  const data = [
    { name: 'Advancing', value: advancing, percent: advancingPercent },
    { name: 'Declining', value: declining, percent: decliningPercent },
    { name: 'Unchanged', value: unchanged, percent: unchangedPercent }
  ];

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Advancing vs Declining</CardTitle>
        <TooltipProvider>
          <UITooltip>
            <TooltipTrigger asChild>
              <InfoCircle className="h-5 w-5 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Shows the number of stocks that are gaining (advancing) versus losing (declining) in the current session.</p>
            </TooltipContent>
          </UITooltip>
        </TooltipProvider>
      </CardHeader>
      <CardDescription className="px-6 text-base">
        Market participation: {advancingPercent}% up / {decliningPercent}% down
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
              <YAxis dataKey="name" type="category" />
              <Tooltip
                formatter={(value, name, props) => [`${value} stocks (${props.payload.percent}%)`, props.payload.name]}
              />
              <Bar 
                dataKey="value" 
                fill={(entry) => entry.name === 'Advancing' ? 
                  '#22C55E' : 
                  entry.name === 'Declining' ? 
                  '#EF4444' : 
                  '#9CA3AF'
                } 
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

export default AdvancingDeclining;
