
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, ChevronLeft, Plus, Star, StarOff } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchWatchlistData, WatchlistItem } from "@/lib/api";
import { useWatchlist } from "@/contexts/WatchlistContext";
import PercentageChange from "@/components/ui/percentage-change";
import { Link } from "react-router-dom";

interface StockDetailsCardProps {
  symbol: string;
  onBack?: () => void;
}

export function StockDetailsCard({ symbol, onBack }: StockDetailsCardProps) {
  const [stockData, setStockData] = useState<WatchlistItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { watchlistGroups, addSymbolToWatchlist, removeSymbolFromWatchlist } = useWatchlist();
  
  // Check if the stock is in any watchlist
  const isInWatchlist = watchlistGroups.some(group => 
    group.symbols.includes(symbol)
  );
  
  // Find which watchlist contains this symbol
  const containingWatchlist = watchlistGroups.find(group => 
    group.symbols.includes(symbol)
  );

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchWatchlistData([symbol]);
        if (data && data.length > 0) {
          setStockData(data[0]);
        }
      } catch (error) {
        console.error("Error fetching stock data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [symbol]);

  const toggleWatchlist = () => {
    if (isInWatchlist && containingWatchlist) {
      removeSymbolFromWatchlist(containingWatchlist.id, symbol);
    } else if (watchlistGroups.length > 0) {
      // Add to the first watchlist if not in any
      addSymbolToWatchlist(watchlistGroups[0].id, symbol);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {onBack && (
              <Button variant="ghost" size="sm" className="mr-2" onClick={onBack}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            )}
            <div>
              <CardTitle className="text-2xl flex items-center">
                {isLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <>
                    {symbol}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="ml-2" 
                      onClick={toggleWatchlist}
                      title={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
                    >
                      {isInWatchlist ? (
                        <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                      ) : (
                        <StarOff className="h-5 w-5" />
                      )}
                    </Button>
                  </>
                )}
              </CardTitle>
              {isLoading ? (
                <Skeleton className="h-5 w-40 mt-1" />
              ) : (
                <CardDescription>{stockData?.name}</CardDescription>
              )}
            </div>
          </div>
          
          <Link to={`/technicals/${symbol}`}>
            <Button variant="outline" size="sm">
              <BarChart className="h-4 w-4 mr-1" />
              View Technicals
            </Button>
          </Link>
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        ) : stockData ? (
          <>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
              <div>
                <span className="text-3xl font-bold">${stockData.price.toFixed(2)}</span>
                <span className="ml-3">
                  <PercentageChange 
                    value={stockData.changePercent} 
                    className="text-lg"
                  />
                </span>
              </div>
              
              <div className="mt-2 sm:mt-0 text-sm text-muted-foreground">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-muted rounded-lg p-3">
                <div className="text-sm text-muted-foreground">Change ($)</div>
                <div className={`text-lg font-semibold ${stockData.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {stockData.change >= 0 ? '+' : ''}{stockData.change.toFixed(2)}
                </div>
              </div>
              
              <div className="bg-muted rounded-lg p-3">
                <div className="text-sm text-muted-foreground">Change (%)</div>
                <div className="text-lg font-semibold">
                  <PercentageChange value={stockData.changePercent} showIcon={false} />
                </div>
              </div>
              
              {/* Placeholder for additional metrics - in a real app, these would come from the API */}
              <div className="bg-muted rounded-lg p-3">
                <div className="text-sm text-muted-foreground">Market Cap</div>
                <div className="text-lg font-semibold">N/A</div>
              </div>
              
              <div className="bg-muted rounded-lg p-3">
                <div className="text-sm text-muted-foreground">Volume</div>
                <div className="text-lg font-semibold">N/A</div>
              </div>
            </div>
            
            <div className="text-center p-6 border rounded-md bg-muted/20">
              <p>Technical indicators and detailed charts would be displayed here.</p>
              <p className="text-sm text-muted-foreground mt-2">This is a placeholder for the detailed view.</p>
            </div>
          </>
        ) : (
          <div className="text-center p-6">
            <p>No data available for {symbol}</p>
            <Button className="mt-4" variant="outline" onClick={() => onBack && onBack()}>
              <ChevronLeft className="mr-1 h-4 w-4" />
              Go Back
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default StockDetailsCard;
