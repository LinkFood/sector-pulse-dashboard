
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { 
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger
} from "@/components/ui/context-menu";
import { WatchlistItem } from "@/lib/api";
import { useWatchlist, WatchlistGroup } from "@/contexts/WatchlistContext";
import PercentageChange from "@/components/ui/percentage-change";
import { ArrowDownAZ, ArrowUpAZ, ChevronDown, ChevronUp, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

interface WatchlistCardProps {
  watchlistId: string;
  className?: string;
  isCompact?: boolean;
}

export function WatchlistCard({ watchlistId, className, isCompact = false }: WatchlistCardProps) {
  const { 
    watchlistGroups, 
    watchlistData, 
    isLoading,
    removeSymbolFromWatchlist, 
    addSymbolToWatchlist,
    sortWatchlist,
    toggleWatchlistExpanded,
    updateWatchlistGroup
  } = useWatchlist();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [newSymbol, setNewSymbol] = useState("");
  
  // Find the current watchlist group
  const currentGroup = watchlistGroups.find(group => group.id === watchlistId);
  if (!currentGroup) {
    console.warn(`Watchlist group with ID "${watchlistId}" not found`);
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Watchlist Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">The requested watchlist could not be found.</p>
        </CardContent>
      </Card>
    );
  }
  
  const watchlist = watchlistData[watchlistId] || [];
  
  const filteredWatchlist = searchTerm
    ? watchlist.filter(
        item => item.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
               item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : watchlist;

  const handleAddSymbol = () => {
    if (!newSymbol) return;
    
    addSymbolToWatchlist(watchlistId, newSymbol);
    setNewSymbol("");
  };

  const handleRemoveSymbol = (symbol: string) => {
    removeSymbolFromWatchlist(watchlistId, symbol);
  };

  const handleSort = (sortBy: string) => {
    const currentSortBy = currentGroup.sortBy;
    const currentDirection = currentGroup.sortDirection || 'asc';
    
    // If already sorting by this field, toggle direction
    const newDirection = (currentSortBy === sortBy && currentDirection === 'asc') ? 'desc' : 'asc';
    
    sortWatchlist(watchlistId, sortBy, newDirection);
  };

  const toggleExpanded = () => {
    toggleWatchlistExpanded(watchlistId);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateWatchlistGroup({
      ...currentGroup,
      name: e.target.value
    });
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <Collapsible 
          open={currentGroup.expanded !== false} 
          onOpenChange={toggleExpanded}
          className="w-full"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
            <div className="flex items-center">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="p-0 h-6 w-6">
                  {currentGroup.expanded !== false ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              
              {isCompact ? (
                <CardTitle className="text-lg font-semibold ml-2">
                  {currentGroup.name}
                </CardTitle>
              ) : (
                <Input 
                  className="ml-2 h-7 w-[150px] sm:w-[200px] text-lg font-semibold bg-transparent border-0 px-0 focus-visible:ring-0 focus-visible:border-b"
                  value={currentGroup.name}
                  onChange={handleNameChange}
                />
              )}
            </div>
            
            <CollapsibleContent className="w-full sm:w-auto">
              <div className="flex w-full sm:w-auto space-x-2 mt-2 sm:mt-0">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search symbols..."
                    className="pl-8 w-full sm:w-[180px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                {!isCompact && (
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add symbol..."
                      className="w-[100px]"
                      value={newSymbol}
                      onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddSymbol()}
                    />
                    <Button size="sm" onClick={handleAddSymbol}>
                      <Plus className="mr-1 h-4 w-4" />
                      Add
                    </Button>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      </CardHeader>

      {/* We need to wrap this CardContent in the same Collapsible as above */}
      <Collapsible 
        open={currentGroup.expanded !== false} 
        onOpenChange={toggleExpanded}
      >
        <CollapsibleContent>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                {!isCompact && (
                  <>
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </>
                )}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="cursor-pointer w-[80px]" onClick={() => handleSort('symbol')}>
                        <div className="flex items-center">
                          Symbol
                          {currentGroup.sortBy === 'symbol' && (
                            currentGroup.sortDirection === 'asc' ? 
                              <ArrowUpAZ className="ml-1 h-3 w-3" /> : 
                              <ArrowDownAZ className="ml-1 h-3 w-3" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                        <div className="flex items-center">
                          Name
                          {currentGroup.sortBy === 'name' && (
                            currentGroup.sortDirection === 'asc' ? 
                              <ArrowUpAZ className="ml-1 h-3 w-3" /> : 
                              <ArrowDownAZ className="ml-1 h-3 w-3" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="text-right cursor-pointer" onClick={() => handleSort('price')}>
                        <div className="flex items-center justify-end">
                          Price
                          {currentGroup.sortBy === 'price' && (
                            currentGroup.sortDirection === 'asc' ? 
                              <ArrowUpAZ className="ml-1 h-3 w-3" /> : 
                              <ArrowDownAZ className="ml-1 h-3 w-3" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="text-right cursor-pointer" onClick={() => handleSort('changePercent')}>
                        <div className="flex items-center justify-end">
                          Change
                          {currentGroup.sortBy === 'changePercent' && (
                            currentGroup.sortDirection === 'asc' ? 
                              <ArrowUpAZ className="ml-1 h-3 w-3" /> : 
                              <ArrowDownAZ className="ml-1 h-3 w-3" />
                          )}
                        </div>
                      </TableHead>
                      {!isCompact && (
                        <TableHead className="w-[70px]"></TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWatchlist.length > 0 ? (
                      filteredWatchlist.map((item) => (
                        <ContextMenuTrigger key={item.symbol} asChild>
                          <TableRow>
                            <TableCell className="font-medium">
                              <Link to={`/stock/${item.symbol}`} className="hover:underline">
                                {item.symbol}
                              </Link>
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate">
                              {item.name}
                            </TableCell>
                            <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                            <TableCell className="text-right">
                              <PercentageChange value={item.changePercent} />
                            </TableCell>
                            {!isCompact && (
                              <TableCell className="text-right p-0 pr-2">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                      <Link to={`/stock/${item.symbol}`}>View Details</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                      className="text-destructive"
                                      onClick={() => handleRemoveSymbol(item.symbol)}>
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Remove
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            )}

                            <ContextMenuContent>
                              <ContextMenuItem asChild>
                                <Link to={`/stock/${item.symbol}`}>View Details</Link>
                              </ContextMenuItem>
                              <ContextMenuSeparator />
                              <ContextMenuItem 
                                className="text-destructive"
                                onClick={() => handleRemoveSymbol(item.symbol)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Remove
                              </ContextMenuItem>
                            </ContextMenuContent>
                          </TableRow>
                        </ContextMenuTrigger>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={isCompact ? 4 : 5} className="h-24 text-center">
                          {searchTerm ? "No stocks found." : "Your watchlist is empty."}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

export default WatchlistCard;
