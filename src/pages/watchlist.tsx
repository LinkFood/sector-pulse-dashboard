
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { fetchWatchlistData, WatchlistItem, getApiKey } from "@/lib/api";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import PercentageChange from "@/components/ui/percentage-change";
import { Skeleton } from "@/components/ui/skeleton";

const WatchlistPage = () => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [newSymbol, setNewSymbol] = useState("");
  const [savedSymbols, setSavedSymbols] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved symbols from localStorage
    const storedSymbols = localStorage.getItem('watchlist_symbols');
    const initialSymbols = storedSymbols ? JSON.parse(storedSymbols) : ["AAPL", "MSFT", "GOOGL", "AMZN", "NVDA"];
    setSavedSymbols(initialSymbols);
    
    loadWatchlistData(initialSymbols);
  }, []);

  const loadWatchlistData = async (symbols: string[]) => {
    try {
      setIsLoading(true);
      
      // Check if API key is set
      const apiKey = getApiKey();
      if (!apiKey) {
        toast({
          title: "API Key Required",
          description: "Please enter your Polygon.io API key in the sidebar.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const data = await fetchWatchlistData(symbols);
      setWatchlist(data);
    } catch (error) {
      console.error("Error fetching watchlist data:", error);
      toast({
        title: "Failed to load watchlist",
        description: "Please check your API key and connection.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addToWatchlist = () => {
    if (!newSymbol) return;
    
    // Convert to uppercase and trim whitespace
    const formattedSymbol = newSymbol.toUpperCase().trim();
    
    if (savedSymbols.includes(formattedSymbol)) {
      toast({
        title: "Symbol already in watchlist",
        description: `${formattedSymbol} is already in your watchlist.`,
      });
      setNewSymbol("");
      return;
    }
    
    const updatedSymbols = [...savedSymbols, formattedSymbol];
    setSavedSymbols(updatedSymbols);
    localStorage.setItem('watchlist_symbols', JSON.stringify(updatedSymbols));
    
    // Reload watchlist with new symbol
    loadWatchlistData(updatedSymbols);
    setNewSymbol("");
    
    toast({
      title: "Symbol Added",
      description: `${formattedSymbol} has been added to your watchlist.`,
    });
  };

  const removeFromWatchlist = (symbol: string) => {
    const updatedSymbols = savedSymbols.filter(s => s !== symbol);
    setSavedSymbols(updatedSymbols);
    localStorage.setItem('watchlist_symbols', JSON.stringify(updatedSymbols));
    
    // Update the displayed watchlist
    setWatchlist(prev => prev.filter(item => item.symbol !== symbol));
    
    toast({
      title: "Symbol Removed",
      description: `${symbol} has been removed from your watchlist.`,
    });
  };

  const filteredWatchlist = searchTerm
    ? watchlist.filter(
        item => item.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
               item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : watchlist;

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
              <div>
                <CardTitle>Watchlist</CardTitle>
                <CardDescription>
                  Monitor your favorite stocks in one place
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search watchlist..."
                    className="pl-8 w-full sm:w-[200px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add symbol..."
                    value={newSymbol}
                    onChange={(e) => setNewSymbol(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addToWatchlist()}
                    className="w-full sm:w-[120px]"
                  />
                  <Button onClick={addToWatchlist}>
                    <Plus className="mr-1 h-4 w-4" />
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Symbol</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Change</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWatchlist.length > 0 ? (
                      filteredWatchlist.map((item) => (
                        <TableRow key={item.symbol}>
                          <TableCell className="font-medium">{item.symbol}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{item.name}</TableCell>
                          <TableCell className="text-right">
                            ${item.price.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            <PercentageChange value={item.changePercent} />
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromWatchlist(item.symbol)}
                              className="h-8 px-2 text-muted-foreground hover:text-destructive"
                            >
                              Remove
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          {searchTerm 
                            ? "No stocks found matching your search." 
                            : "Your watchlist is empty. Add symbols to get started."}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default WatchlistPage;
