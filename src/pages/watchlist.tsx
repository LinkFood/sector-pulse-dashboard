
import DashboardLayout from "@/layouts/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const WatchlistPage = () => {
  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Watchlist</CardTitle>
            <CardDescription>
              Monitor your favorite stocks in one place
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center py-12">Full Watchlist page is under development</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default WatchlistPage;
