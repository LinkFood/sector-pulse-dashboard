
import React from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PercentageChangeProps {
  value: number;
  showIcon?: boolean;
  className?: string;
  iconClassName?: string;
}

export function PercentageChange({
  value,
  showIcon = true,
  className,
  iconClassName
}: PercentageChangeProps) {
  const isPositive = value >= 0;
  
  return (
    <span
      className={cn(
        isPositive ? 'gain-text' : 'loss-text',
        'inline-flex items-center font-medium',
        className
      )}
    >
      {showIcon && (
        isPositive ? (
          <ArrowUp className={cn('mr-1 h-3 w-3', iconClassName)} />
        ) : (
          <ArrowDown className={cn('mr-1 h-3 w-3', iconClassName)} />
        )
      )}
      {isPositive ? '+' : ''}
      {value.toFixed(2)}%
    </span>
  );
}

export default PercentageChange;
