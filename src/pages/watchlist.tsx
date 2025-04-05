
import DashboardLayout from "@/layouts/dashboard-layout";
import { WatchlistManager } from "@/components/watchlist/watchlist-manager";
import { WatchlistProvider } from "@/contexts/WatchlistContext";

const WatchlistPage = () => {
  return (
    <DashboardLayout>
      <WatchlistProvider>
        <div className="grid gap-6">
          <WatchlistManager />
        </div>
      </WatchlistProvider>
    </DashboardLayout>
  );
};

export default WatchlistPage;
