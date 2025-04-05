
import React, { useState, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useApiData } from '@/hooks/use-api-data';

// Common stock symbols and names for the autocomplete
const COMMON_STOCKS = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "MSFT", name: "Microsoft Corporation" },
  { symbol: "GOOGL", name: "Alphabet Inc." },
  { symbol: "AMZN", name: "Amazon.com Inc." },
  { symbol: "NVDA", name: "NVIDIA Corporation" },
  { symbol: "META", name: "Meta Platforms Inc." },
  { symbol: "TSLA", name: "Tesla, Inc." },
  { symbol: "NFLX", name: "Netflix, Inc." },
  { symbol: "DIS", name: "The Walt Disney Company" },
  { symbol: "BA", name: "Boeing Company" },
  { symbol: "GE", name: "General Electric Company" },
  { symbol: "JPM", name: "JPMorgan Chase & Co." },
  { symbol: "JNJ", name: "Johnson & Johnson" },
  { symbol: "PG", name: "Procter & Gamble Co." },
  { symbol: "KO", name: "The Coca-Cola Company" },
  { symbol: "WMT", name: "Walmart Inc." },
  { symbol: "HD", name: "The Home Depot, Inc." },
  { symbol: "V", name: "Visa Inc." },
  { symbol: "MA", name: "Mastercard Incorporated" },
  { symbol: "PFE", name: "Pfizer Inc." },
  { symbol: "CSCO", name: "Cisco Systems, Inc." },
  { symbol: "VZ", name: "Verizon Communications Inc." },
  { symbol: "T", name: "AT&T Inc." },
  { symbol: "INTC", name: "Intel Corporation" },
  { symbol: "AMD", name: "Advanced Micro Devices, Inc." }
];

interface StockSymbolAutocompleteProps {
  onSearch: (symbol: string) => void;
  isLoading?: boolean;
  initialValue?: string;
}

const StockSymbolAutocomplete: React.FC<StockSymbolAutocompleteProps> = ({
  onSearch,
  isLoading = false,
  initialValue = ''
}) => {
  const [open, setOpen] = useState(false);
  const [symbol, setSymbol] = useState<string>(initialValue);
  const [filteredStocks, setFilteredStocks] = useState(COMMON_STOCKS);

  // Filter stocks based on input
  useEffect(() => {
    if (symbol) {
      const query = symbol.toLowerCase();
      const filtered = COMMON_STOCKS.filter(
        stock => 
          stock.symbol.toLowerCase().includes(query) || 
          stock.name.toLowerCase().includes(query)
      );
      setFilteredStocks(filtered);
    } else {
      setFilteredStocks(COMMON_STOCKS);
    }
  }, [symbol]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (symbol.trim()) {
      onSearch(symbol.trim().toUpperCase());
      setOpen(false);
    }
  };

  const handleSelect = (selected: string) => {
    setSymbol(selected);
    setOpen(false);
    onSearch(selected);
  };

  const handleClear = () => {
    setSymbol('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full">
      <div className="relative flex-grow">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div className="relative w-full">
              <Input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                placeholder="Enter stock symbol (e.g. AAPL)"
                className="pl-10 pr-10"
                disabled={isLoading}
                onClick={() => setOpen(true)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              {symbol && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                  onClick={handleClear}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-full" align="start">
            <Command>
              <CommandInput 
                placeholder="Search stock symbols..." 
                value={symbol}
                onValueChange={setSymbol}
                autoFocus
              />
              <CommandList>
                <CommandEmpty>No stocks found.</CommandEmpty>
                <CommandGroup heading="Common Stocks">
                  {filteredStocks.map((stock) => (
                    <CommandItem
                      key={stock.symbol}
                      value={stock.symbol}
                      onSelect={handleSelect}
                    >
                      <span className="font-bold mr-2">{stock.symbol}</span>
                      <span className="text-sm text-muted-foreground">{stock.name}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <Button type="submit" disabled={isLoading || !symbol.trim()}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </>
        ) : (
          'Analyze'
        )}
      </Button>
    </form>
  );
};

export default StockSymbolAutocomplete;
