
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectorPerformance } from "@/lib/api/types";

interface SectorPerformanceComparisonProps {
  sectors: SectorPerformance[];
}

const SectorPerformanceComparison: React.FC<SectorPerformanceComparisonProps> = ({ sectors }) => {
  // Sort sectors by performance
  const sortedSectors = [...sectors].sort((a, b) => b.performance - a.performance);
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Sector Performance Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedSectors}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" domain={['dataMin', 'dataMax']} tickFormatter={(value) => `${value.toFixed(2)}%`} />
              <YAxis dataKey="sector" type="category" width={100} />
              <Tooltip
                formatter={(value) => [`${Number(value).toFixed(2)}%`, 'Performance']}
                labelFormatter={(label) => label}
              />
              <Bar dataKey="performance" name="Performance">
                {sortedSectors.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.performance >= 0 ? '#22C55E' : '#EF4444'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SectorPerformanceComparison;
