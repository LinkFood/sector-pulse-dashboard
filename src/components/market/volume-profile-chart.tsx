
import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { cn } from '@/lib/utils';

interface VolumeProfileChartProps {
  data: { price: number, volume: number }[];
  significantLevels: number[];
  className?: string;
}

const VolumeProfileChart: React.FC<VolumeProfileChartProps> = ({ 
  data, 
  significantLevels,
  className 
}) => {
  const chartConfig = {
    volume: {
      label: 'Volume',
      theme: {
        light: '#6E59A5',
        dark: '#8B5CF6',
      }
    },
    price: {
      label: 'Price',
      theme: {
        light: '#64748B',
        dark: '#94A3B8',
      }
    },
    level: {
      label: 'Support/Resistance',
      theme: {
        light: '#F97316',
        dark: '#FB923C',
      }
    }
  };

  // Format number for display
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toFixed(0);
  };

  return (
    <ChartContainer config={chartConfig} className={cn('h-[500px] w-full', className)}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
          <XAxis
            type="number"
            domain={[0, 'dataMax']}
            tickFormatter={formatNumber}
            orientation="top"
          />
          <YAxis
            dataKey="price"
            type="number"
            domain={['dataMin', 'dataMax']}
            tickCount={10}
            tickFormatter={(value) => value.toFixed(2)}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload || payload.length === 0) return null;
              
              return (
                <div className="rounded-lg border bg-background p-2 shadow-md">
                  <p className="text-sm font-medium">Price: ${payload[0].payload.price.toFixed(2)}</p>
                  <p className="text-sm">Volume: {formatNumber(payload[0].payload.volume)}</p>
                </div>
              );
            }}
          />
          <Bar
            dataKey="volume"
            fill="var(--color-volume)"
            opacity={0.85}
            animationDuration={500}
          />
          
          {/* Render reference lines for significant levels */}
          {significantLevels.map((level, i) => (
            <ReferenceLine
              key={`level-${i}`}
              y={level}
              stroke="var(--color-level)"
              strokeWidth={2}
              strokeDasharray="3 3"
              label={{
                value: `$${level.toFixed(2)}`,
                position: 'insideLeft',
                fill: 'var(--color-level)',
                fontSize: 12
              }}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default VolumeProfileChart;
