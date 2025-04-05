
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ScreenerParams } from "@/lib/api/screener";
import { useQuery } from "@tanstack/react-query";
import { getSectors } from "@/lib/api/screener";
import { Search, Filter, RefreshCw } from "lucide-react";

interface FilterSectionProps {
  onFilterChange: (filters: ScreenerParams) => void;
  isLoading?: boolean;
}

export function FilterSection({ onFilterChange, isLoading }: FilterSectionProps) {
  // Default filter state
  const [filters, setFilters] = useState<ScreenerParams>({
    minPrice: 0,
    maxPrice: 1000,
    minVolume: 0,
    maxVolume: 10000000,
    marketCap: undefined,
    sector: undefined,
    above50dma: false,
    below50dma: false,
    above200dma: false,
    below200dma: false,
    minRsi: 0,
    maxRsi: 100,
    limit: 20,
    page: 1,
    sortBy: 'market_cap',
    sortDirection: 'desc',
  });

  // Fetch sectors
  const { data: sectors = [] } = useQuery({
    queryKey: ['sectors'],
    queryFn: getSectors,
  });

  // Handle filter changes
  const handleChange = (field: keyof ScreenerParams, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  // Apply filters
  const applyFilters = () => {
    onFilterChange(filters);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      minPrice: 0,
      maxPrice: 1000,
      minVolume: 0,
      maxVolume: 10000000,
      marketCap: undefined,
      sector: undefined,
      above50dma: false,
      below50dma: false,
      above200dma: false,
      below200dma: false,
      minRsi: 0,
      maxRsi: 100,
      limit: 20,
      page: 1,
      sortBy: 'market_cap',
      sortDirection: 'desc',
    });
    onFilterChange({
      limit: 20,
      page: 1,
      sortBy: 'market_cap',
      sortDirection: 'desc',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Screening Criteria</CardTitle>
        <CardDescription>
          Define your stock screening criteria
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Price Range */}
          <div className="space-y-2">
            <Label htmlFor="price-range">Price Range ($)</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input 
                id="min-price" 
                placeholder="Min" 
                type="number" 
                min={0}
                value={filters.minPrice} 
                onChange={(e) => handleChange('minPrice', Number(e.target.value))}
              />
              <Input 
                id="max-price" 
                placeholder="Max" 
                type="number" 
                min={0}
                value={filters.maxPrice} 
                onChange={(e) => handleChange('maxPrice', Number(e.target.value))}
              />
            </div>
            <Slider 
              value={[filters.minPrice || 0, filters.maxPrice || 1000]} 
              min={0} 
              max={1000}
              step={10}
              onValueChange={(values) => {
                handleChange('minPrice', values[0]);
                handleChange('maxPrice', values[1]);
              }}
              className="mt-2"
            />
          </div>
          
          {/* Volume Range */}
          <div className="space-y-2">
            <Label htmlFor="volume-range">Volume</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input 
                id="min-volume" 
                placeholder="Min" 
                type="number" 
                min={0}
                value={filters.minVolume} 
                onChange={(e) => handleChange('minVolume', Number(e.target.value))}
              />
              <Input 
                id="max-volume" 
                placeholder="Max" 
                type="number"
                min={0} 
                value={filters.maxVolume} 
                onChange={(e) => handleChange('maxVolume', Number(e.target.value))}
              />
            </div>
          </div>
          
          {/* Market Cap */}
          <div className="space-y-2">
            <Label htmlFor="market-cap">Market Cap</Label>
            <Select 
              value={filters.marketCap} 
              onValueChange={(value) => handleChange('marketCap', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Market Cap" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any</SelectItem>
                <SelectItem value="small">Small Cap (&lt; $2B)</SelectItem>
                <SelectItem value="mid">Mid Cap ($2B - $10B)</SelectItem>
                <SelectItem value="large">Large Cap (&gt; $10B)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Sector */}
          <div className="space-y-2">
            <Label htmlFor="sector">Sector</Label>
            <Select 
              value={filters.sector} 
              onValueChange={(value) => handleChange('sector', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Sector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Sectors</SelectItem>
                {sectors.map((sector) => (
                  <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Technical Indicators */}
          <div className="space-y-2">
            <Label className="block mb-2">Technical Indicators</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="above-50dma" 
                  checked={filters.above50dma} 
                  onCheckedChange={(checked) => handleChange('above50dma', checked === true)} 
                />
                <Label htmlFor="above-50dma">Above 50-day MA</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="below-50dma" 
                  checked={filters.below50dma} 
                  onCheckedChange={(checked) => handleChange('below50dma', checked === true)} 
                />
                <Label htmlFor="below-50dma">Below 50-day MA</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="above-200dma" 
                  checked={filters.above200dma} 
                  onCheckedChange={(checked) => handleChange('above200dma', checked === true)} 
                />
                <Label htmlFor="above-200dma">Above 200-day MA</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="below-200dma" 
                  checked={filters.below200dma} 
                  onCheckedChange={(checked) => handleChange('below200dma', checked === true)} 
                />
                <Label htmlFor="below-200dma">Below 200-day MA</Label>
              </div>
            </div>
          </div>
          
          {/* RSI Range */}
          <div className="space-y-2">
            <Label htmlFor="rsi-range">RSI Range</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input 
                id="min-rsi" 
                placeholder="Min" 
                type="number" 
                min={0}
                max={100}
                value={filters.minRsi} 
                onChange={(e) => handleChange('minRsi', Number(e.target.value))}
              />
              <Input 
                id="max-rsi" 
                placeholder="Max" 
                type="number" 
                min={0}
                max={100}
                value={filters.maxRsi} 
                onChange={(e) => handleChange('maxRsi', Number(e.target.value))}
              />
            </div>
            <Slider 
              value={[filters.minRsi || 0, filters.maxRsi || 100]} 
              min={0} 
              max={100}
              step={1}
              onValueChange={(values) => {
                handleChange('minRsi', values[0]);
                handleChange('maxRsi', values[1]);
              }}
              className="mt-2"
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 justify-end">
          <Button variant="outline" onClick={resetFilters} disabled={isLoading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button onClick={applyFilters} disabled={isLoading}>
            {isLoading ? (
              <>Searching...</>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Apply Filters
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default FilterSection;
