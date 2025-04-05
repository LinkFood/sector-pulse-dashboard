
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useWatchlist } from "@/contexts/WatchlistContext";
import { Plus, RefreshCw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WatchlistCard from "./watchlist-card";
import { Skeleton } from "@/components/ui/skeleton";

export function WatchlistManager() {
  const { 
    watchlistGroups, 
    isLoading, 
    activeWatchlist, 
    setActiveWatchlist, 
    addWatchlistGroup, 
    refreshWatchlistData 
  } = useWatchlist();
  
  const [newWatchlistName, setNewWatchlistName] = useState("");

  const handleAddWatchlist = () => {
    if (!newWatchlistName.trim()) return;
    
    addWatchlistGroup(newWatchlistName);
    setNewWatchlistName("");
  };

  const handleRefresh = async () => {
    await refreshWatchlistData();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
          <div>
            <CardTitle>Watchlists</CardTitle>
            <CardDescription>
              Create and manage your stock watchlists
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="mr-1 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 mt-4">
          <Input
            placeholder="New watchlist name..."
            value={newWatchlistName}
            onChange={(e) => setNewWatchlistName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddWatchlist()}
            className="flex-1"
          />
          <Button onClick={handleAddWatchlist}>
            <Plus className="mr-1 h-4 w-4" />
            Add Watchlist
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading && watchlistGroups.length === 0 ? (
          <div className="space-y-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : watchlistGroups.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No watchlists created yet.</p>
            <p className="text-muted-foreground">Create your first watchlist to get started.</p>
          </div>
        ) : watchlistGroups.length === 1 ? (
          <WatchlistCard watchlistId={watchlistGroups[0].id} />
        ) : (
          <Tabs 
            value={activeWatchlist || watchlistGroups[0].id} 
            onValueChange={setActiveWatchlist}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 sm:flex sm:flex-wrap">
              {watchlistGroups.map((group) => (
                <TabsTrigger key={group.id} value={group.id}>
                  {group.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {watchlistGroups.map((group) => (
              <TabsContent key={group.id} value={group.id}>
                <WatchlistCard watchlistId={group.id} />
              </TabsContent>
            ))}
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}

export default WatchlistManager;
