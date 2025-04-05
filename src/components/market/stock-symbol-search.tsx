
import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import StockSymbolAutocomplete from './stock-symbol-autocomplete';

interface StockSymbolSearchProps {
  onSearch: (symbol: string) => void;
  isLoading?: boolean;
}

const StockSymbolSearch: React.FC<StockSymbolSearchProps> = ({ 
  onSearch,
  isLoading = false
}) => {
  // Use the new autocomplete component
  return <StockSymbolAutocomplete onSearch={onSearch} isLoading={isLoading} initialValue="AAPL" />;
};

export default StockSymbolSearch;
