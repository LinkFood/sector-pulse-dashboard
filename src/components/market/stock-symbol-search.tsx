
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface StockSymbolSearchProps {
  onSearch: (symbol: string) => void;
  isLoading?: boolean;
}

const StockSymbolSearch: React.FC<StockSymbolSearchProps> = ({ 
  onSearch,
  isLoading = false
}) => {
  const [symbol, setSymbol] = useState<string>('AAPL');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (symbol.trim()) {
      onSearch(symbol.trim().toUpperCase());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <div className="relative flex-grow">
        <Input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="Enter stock symbol (e.g. AAPL)"
          className="pl-10"
          disabled={isLoading}
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>
      <Button type="submit" disabled={isLoading || !symbol.trim()}>
        {isLoading ? 'Loading...' : 'Analyze'}
      </Button>
    </form>
  );
};

export default StockSymbolSearch;
