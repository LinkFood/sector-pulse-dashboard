
import { useState, useEffect } from "react";
import { toast } from "sonner"; 
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
import { Link } from "react-router-dom";

const Index = () => {
  const [indices, setIndices] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Check if API key is set
        const apiKey = getApiKey();
        if (!apiKey) {
          toast.error("API Key Required. Please configure your Polygon.io API key.");
          setIsLoading(false);
          return;
        }

        console.log("Fetching market data...");
        
        // Fetch data in parallel with proper error handling for each request
        try {
          const indicesData = await fetchMarketIndices();
          console.log("Indices data:", indicesData);
          setIndices(indicesData);
        } catch (error) {
          console.error("Failed to fetch indices:", error);
          toast.error("Failed to load market indices data");
        }
        
        try {
          const sectorsData = await fetchSectorPerformance();
          console.log("Sectors data:", sectorsData);
          setSectors(sectorsData);
        } catch (error) {
          console.error("Failed to fetch sectors:", error);
          toast.error("Failed to load sector performance data");
        }
        
        try {
          const watchlistData = await fetchWatchlistData([]);
          console.log("Watchlist data:", watchlistData);
          setWatchlist(watchlistData);
        } catch (error) {
          console.error("Failed to fetch watchlist:", error);
          toast.error("Failed to load watchlist data");
        }
      } catch (error) {
        console.error("Error in main fetch operation:", error);
        toast.error("Error loading dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [retryCount]);

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
                  Please configure your Polygon.io API key to fetch market data.
                </p>
                <Button asChild>
                  <Link to="/api-config">Configure API Key</Link>
                </Button>
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
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                      <Button variant="outline" onClick={handleRetry}>
                        Retry
                      </Button>
                      <Button asChild>
                        <Link to="/api-config">Check API Configuration</Link>
                      </Button>
                    </div>
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
