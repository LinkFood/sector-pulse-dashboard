
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import DashboardLayout from "@/layouts/dashboard-layout";
import MarketIndicesCard from "@/components/market/market-indices-card";
import SectorHeatmap from "@/components/market/sector-heatmap";
import WatchlistCard from "@/components/watchlist/watchlist-card";
import { 
  fetchMarketIndices, 
  fetchSectorPerformance, 
  fetchWatchlistData,
  getApiKey
} from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [indices, setIndices] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
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

        // Fetch data in parallel
        const [indicesData, sectorsData, watchlistData] = await Promise.all([
          fetchMarketIndices(),
          fetchSectorPerformance(),
          fetchWatchlistData([]), // Empty array to use default watchlist
        ]);

        setIndices(indicesData);
        setSectors(sectorsData);
        setWatchlist(watchlistData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Failed to load market data",
          description: "Please check your API key and connection.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast, retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        {isLoading ? (
          <>
            <Skeleton className="h-40 w-full" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Skeleton className="h-80 lg:col-span-2" />
              <Skeleton className="h-80 lg:col-span-1" />
            </div>
          </>
        ) : (
          <>
            {!getApiKey() ? (
              <div className="bg-muted p-6 rounded-lg text-center">
                <h3 className="text-xl font-semibold mb-2">API Key Required</h3>
                <p className="mb-4">
                  Please enter your Polygon.io API key in the sidebar to fetch market data.
                </p>
              </div>
            ) : (
              <>
                <MarketIndicesCard indices={indices} />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <SectorHeatmap sectors={sectors} className="lg:col-span-2" />
                  <WatchlistCard watchlist={watchlist} className="lg:col-span-1" />
                </div>
                {(!indices.length || !sectors.length || !watchlist.length) && (
                  <div className="bg-muted p-6 rounded-lg text-center mt-4">
                    <h3 className="text-lg font-semibold mb-2">Data Fetch Issue</h3>
                    <p className="mb-4">
                      There was an issue retrieving market data. Please check your API key or try again.
                    </p>
                    <Button variant="outline" onClick={handleRetry}>
                      Retry
                    </Button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Index;
