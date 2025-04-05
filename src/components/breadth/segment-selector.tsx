
import React from 'react';
import { Button } from "@/components/ui/button";
import { MarketSegment } from '@/lib/api/breadth';

interface SegmentSelectorProps {
  selectedSegment: MarketSegment;
  onSegmentChange: (segment: MarketSegment) => void;
}

export const SegmentSelector: React.FC<SegmentSelectorProps> = ({
  selectedSegment,
  onSegmentChange
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {Object.values(MarketSegment).map((segment) => (
        <Button
          key={segment}
          variant={selectedSegment === segment ? "default" : "outline"}
          size="sm"
          onClick={() => onSegmentChange(segment as MarketSegment)}
        >
          {segment}
        </Button>
      ))}
    </div>
  );
};

export default SegmentSelector;
