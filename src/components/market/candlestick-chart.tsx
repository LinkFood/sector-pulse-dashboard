
import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Scatter,
  Line,
  ReferenceArea
} from 'recharts';
import { ChartContainer } from '@/components/ui/chart';
import { AggregateBar } from '@/lib/api/volume';
import { cn } from '@/lib/utils';

interface CandlestickChartProps {
  data: AggregateBar[];
  significantLevels: number[];
  className?: string;
}

const CandlestickChart: React.FC<CandlestickChartProps> = ({ data, significantLevels, className }) => {
  const chartConfig = {
    candle: {
      label: 'Price',
      theme: {
        light: '#6E59A5',
        dark: '#8B5CF6',
      }
    },
    up: {
      label: 'Gain',
      theme: {
        light: '#22C55E',
        dark: '#22C55E',
      }
    },
    down: {
      label: 'Loss',
      theme: {
        light: '#EF4444',
        dark: '#EF4444',
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

  // Process data for candlestick rendering
  const processedData = data.map(item => ({
    ...item,
    t: new Date(item.t).toLocaleDateString(),
    range: [item.l, item.h],
    middle: [item.o, item.c]
  }));

  return (
    <ChartContainer config={chartConfig} className={cn('h-[500px] w-full', className)}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={processedData}
          margin={{ top: 10, right: 30, left: 20, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="t" 
            scale="auto" 
            interval="preserveStartEnd" 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => {
              // Format based on the timeframe
              const date = new Date(value);
              return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
            }}
          />
          <YAxis 
            domain={['dataMin', 'dataMax']} 
            orientation="right"
            tickFormatter={(value) => value.toFixed(2)}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length > 0) {
                const data = payload[0].payload;
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-md">
                    <p className="text-sm font-medium">{new Date(data.t).toLocaleDateString()}</p>
                    <p className="text-sm">Open: ${data.o.toFixed(2)}</p>
                    <p className="text-sm">High: ${data.h.toFixed(2)}</p>
                    <p className="text-sm">Low: ${data.l.toFixed(2)}</p>
                    <p className="text-sm">Close: ${data.c.toFixed(2)}</p>
                    <p className="text-sm">Volume: {data.v.toLocaleString()}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          
          {/* Render vertical lines for each candle */}
          {processedData.map((item, i) => {
            const isUp = item.c >= item.o;
            const color = isUp ? "var(--color-up)" : "var(--color-down)";
            
            return (
              <React.Fragment key={`candle-${i}`}>
                <Line 
                  key={`range-${i}`}
                  type="step" 
                  dataKey="range" 
                  stroke={color} 
                  dot={false}
                  activeDot={false}
                  connectNulls
                />
                <Scatter 
                  key={`body-${i}`}
                  name="middle"
                  data={[item]} 
                  line={{ stroke: color, strokeWidth: 6 }} 
                  // Removed the invalid lineType="vertical" property
                  // Replaced "none" with a valid empty shape function
                  shape={() => null}
                  legendType="none"
                />
              </React.Fragment>
            );
          })}
          
          {/* Render support/resistance zones */}
          {significantLevels.map((level, i) => (
            <ReferenceArea
              key={`level-${i}`}
              y1={level - 0.3}
              y2={level + 0.3}
              fill="var(--color-level)"
              fillOpacity={0.2}
              strokeOpacity={0.3}
              ifOverflow="extendDomain"
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default CandlestickChart;
