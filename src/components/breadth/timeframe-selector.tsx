
import React from 'react';
import { Button } from "@/components/ui/button";

interface TimeframeOption {
  label: string;
  value: string;
}

interface TimeframeSelectorProps {
  selectedTimeframe: string;
  onTimeframeChange: (timeframe: string) => void;
}

const timeframeOptions: TimeframeOption[] = [
  { label: '1D', value: '1D' },
  { label: '1W', value: '1W' },
  { label: '1M', value: '1M' },
  { label: '3M', value: '3M' },
  { label: '6M', value: '6M' },
  { label: '1Y', value: '1Y' },
];

export const TimeframeSelector: React.FC<TimeframeSelectorProps> = ({
  selectedTimeframe,
  onTimeframeChange
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {timeframeOptions.map((option) => (
        <Button
          key={option.value}
          variant={selectedTimeframe === option.value ? "default" : "outline"}
          size="sm"
          onClick={() => onTimeframeChange(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
};

export default TimeframeSelector;
