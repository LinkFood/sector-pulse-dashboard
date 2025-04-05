
import { useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Line,
  Area,
  Scatter,
  Legend,
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Card } from "@/components/ui/card";
import { ProcessedBar } from "@/lib/technicals/types";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface TechnicalChartProps {
  data: ProcessedBar[];
  isLoading: boolean;
  activeIndicators: string[];
  chartType: 'candlestick' | 'line' | 'area';
  className?: string;
}

const TechnicalChart: React.FC<TechnicalChartProps> = ({ 
  data, 
  isLoading, 
  activeIndicators,
  chartType = 'candlestick',
  className 
}) => {
  // Get indicator colors and config
  const chartConfig = {
    price: {
      label: 'Price',
      theme: {
        light: '#6E59A5',
        dark: '#8B5CF6',
      }
    },
    volume: {
      label: 'Volume',
      theme: {
        light: '#94A3B8',
        dark: '#64748B',
      }
    },
    sma: {
      label: 'SMA (20)',
      theme: {
        light: '#10B981',
        dark: '#10B981',
      }
    },
    ema: {
      label: 'EMA (9)',
      theme: {
        light: '#F59E0B',
        dark: '#FBBF24',
      }
    },
    bollinger: {
      label: 'Bollinger Bands',
      theme: {
        light: '#0EA5E9',
        dark: '#38BDF8',
      }
    },
    macd: {
      label: 'MACD',
      theme: {
        light: '#EC4899',
        dark: '#F472B6',
      }
    },
    rsi: {
      label: 'RSI (14)',
      theme: {
        light: '#8B5CF6',
        dark: '#A78BFA',
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
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 h-[500px] w-full">
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  // Return empty state when no data
  if (!data || data.length === 0) {
    return (
      <Card className="flex items-center justify-center h-[500px]">
        <p className="text-muted-foreground">No data available. Try a different symbol or timeframe.</p>
      </Card>
    );
  }

  // Format data for chart
  const processedData = data.map(item => ({
    ...item,
    formattedDate: new Date(item.t).toLocaleDateString(),
    range: [item.l, item.h],
    middle: [item.o, item.c],
  }));

  return (
    <ChartContainer config={chartConfig} className={cn('h-[600px] w-full', className)}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={processedData}
          margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="formattedDate" 
            tick={{ fontSize: 12 }}
            padding={{ left: 10, right: 10 }}
            tickMargin={10}
          />
          <YAxis 
            domain={['auto', 'auto']}
            orientation="right"
            tickFormatter={(value) => value.toFixed(2)}
            padding={{ top: 20, bottom: 20 }}
          />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend />

          {/* Render base chart type */}
          {chartType === 'line' && (
            <Line 
              type="monotone" 
              dataKey="c" 
              name="price"
              stroke="var(--color-price)" 
              dot={false} 
              animationDuration={500}
            />
          )}

          {chartType === 'area' && (
            <Area 
              type="monotone" 
              dataKey="c" 
              name="price"
              stroke="var(--color-price)"
              fill="var(--color-price)" 
              fillOpacity={0.1} 
              animationDuration={500}
            />
          )}

          {chartType === 'candlestick' && (
            <>
              {/* Render each candlestick */}
              {processedData.map((item, i) => {
                const isUp = item.c >= item.o;
                const color = isUp ? "var(--color-up)" : "var(--color-down)";
                const key = `candle-${i}`;
                
                return (
                  <Line 
                    key={key}
                    data={[item]} 
                    dataKey="range" 
                    stroke={color} 
                    dot={false}
                    isAnimationActive={false}
                  />
                );
              })}
              
              {/* Render candle bodies */}
              {processedData.map((item, i) => {
                const isUp = item.c >= item.o;
                const color = isUp ? "var(--color-up)" : "var(--color-down)";
                const key = `body-${i}`;
                
                return (
                  <Scatter 
                    key={key}
                    name="Price"
                    data={[item]} 
                    line={{ stroke: color, strokeWidth: 8 }}
                    shape={() => null}
                    legendType="none"
                    isAnimationActive={false}
                  />
                );
              })}
            </>
          )}

          {/* Render active indicators */}
          {activeIndicators.includes('sma') && (
            <Line 
              type="monotone" 
              dataKey="sma20" 
              name="sma"
              dot={false}
              stroke="var(--color-sma)" 
              strokeWidth={1.5}
            />
          )}
          
          {activeIndicators.includes('ema') && (
            <Line 
              type="monotone" 
              dataKey="ema9" 
              name="ema"
              dot={false} 
              stroke="var(--color-ema)" 
              strokeWidth={1.5}
            />
          )}

          {activeIndicators.includes('bollinger') && (
            <>
              <Line 
                type="monotone" 
                dataKey="upperBand" 
                name="bollinger"
                dot={false} 
                stroke="var(--color-bollinger)" 
                strokeWidth={1}
                strokeDasharray="3 3"
              />
              <Line 
                type="monotone" 
                dataKey="lowerBand" 
                name="bollinger"
                dot={false} 
                stroke="var(--color-bollinger)" 
                strokeWidth={1}
                strokeDasharray="3 3"
              />
            </>
          )}

          {activeIndicators.includes('macd') && (
            <Line 
              type="monotone" 
              dataKey="macd" 
              name="macd"
              dot={false} 
              stroke="var(--color-macd)" 
              strokeWidth={1.5}
              yAxisId="right"
            />
          )}

          {activeIndicators.includes('rsi') && (
            <Line 
              type="monotone" 
              dataKey="rsi" 
              name="rsi"
              dot={false} 
              stroke="var(--color-rsi)" 
              strokeWidth={1.5}
              yAxisId="right"
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default TechnicalChart;
