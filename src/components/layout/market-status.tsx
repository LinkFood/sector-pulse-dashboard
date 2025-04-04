
import { useState, useEffect } from "react";
import { fetchMarketStatus, MarketStatus } from "@/lib/api";

export function MarketStatusIndicator() {
  const [status, setStatus] = useState<MarketStatus | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Fetch market status
    const getStatus = async () => {
      try {
        const data = await fetchMarketStatus();
        setStatus(data);
      } catch (error) {
        console.error("Failed to fetch market status:", error);
      }
    };
    
    getStatus();
    
    // Update the time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  if (!status) {
    return <div className="text-xs text-muted-foreground">Loading market status...</div>;
  }
  
  const isMarketOpen = status.exchanges.nasdaq?.status === "open";
  const formattedTime = currentTime.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    timeZoneName: 'short'
  });
  
  return (
    <div className="flex items-center space-x-2">
      <div className={`h-2 w-2 rounded-full ${isMarketOpen ? 'bg-gain-500' : 'bg-loss-500'}`} />
      <span className="text-xs">
        Market {isMarketOpen ? 'Open' : 'Closed'} • {formattedTime}
      </span>
    </div>
  );
}

export default MarketStatusIndicator;
