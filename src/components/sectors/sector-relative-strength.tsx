
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SectorPerformance } from "@/lib/api/types";

interface SectorRelativeStrengthProps {
  sectors: SectorPerformance[];
}

const COLORS = [
  '#22C55E', '#10B981', '#0EA5E9', '#8B5CF6', '#EC4899', 
  '#F43F5E', '#F59E0B', '#0D9488', '#6366F1', '#6b7280', '#ef4444'
];

export function SectorRelativeStrength({ sectors }: SectorRelativeStrengthProps) {
  // Mock data for historical relative performance
  // In a real implementation, this would come from API calls
  const generateHistoricalData = () => {
    const dates = [
      "2023-10-01", "2023-11-01", "2023-12-01", 
      "2024-01-01", "2024-02-01", "2024-03-01", "2024-04-01"
    ];
    
    return dates.map(date => {
      const dataPoint: any = { date };
      
      sectors.forEach(sector => {
        // Generate a realistic looking relative strength line
        // based on the current performance as an endpoint
        const basePerformance = sector.performance;
        const volatility = Math.random() * 0.5 + 0.5; // Random volatility factor
        const trend = basePerformance / 7; // Trend factor based on current performance
        
        // Generate a semi-random walk with trend
        const dateIndex = dates.indexOf(date);
        let cumulativePerformance = 0;
        
        for (let i = 0; i <= dateIndex; i++) {
          const randomFactor = (Math.random() - 0.5) * volatility;
          cumulativePerformance += trend + randomFactor;
        }
        
        dataPoint[sector.sector] = Number(cumulativePerformance.toFixed(2));
      });
      
      return dataPoint;
    });
  };
  
  const historicalData = generateHistoricalData();
  
  // Get top 5 performing sectors
  const topSectors = [...sectors]
    .sort((a, b) => b.performance - a.performance)
    .slice(0, 5)
    .map(sector => sector.sector);
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Sector Relative Strength</CardTitle>
        <CardDescription>
          Relative performance compared to S&P 500 over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={historicalData}
              margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={(value) => `${value.toFixed(1)}%`} />
              <Tooltip formatter={(value) => [`${value}%`, '']} />
              <ReferenceLine y={0} stroke="#666" />
              <Legend />
              {topSectors.map((sector, index) => (
                <Line
                  key={sector}
                  type="monotone"
                  dataKey={sector}
                  stroke={COLORS[index % COLORS.length]}
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
