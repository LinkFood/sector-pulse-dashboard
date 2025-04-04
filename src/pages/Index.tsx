
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

const Index = () => {
  const [indices, setIndices] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
        }

        // Fetch data in parallel
        const [indicesData, sectorsData, watchlistData] = await Promise.all([
          fetchMarketIndices(),
          fetchSectorPerformance(),
          fetchWatchlistData([]), // Empty array since we're using mock data for now
        ]);

        setIndices(indicesData);
        setSectors(sectorsData);
        setWatchlist(watchlistData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Failed to load market data",
          description: "Please check your connection and try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <MarketIndicesCard indices={indices} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SectorHeatmap sectors={sectors} className="lg:col-span-2" />
          <WatchlistCard watchlist={watchlist} className="lg:col-span-1" />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
