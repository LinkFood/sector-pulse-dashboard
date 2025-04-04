
import DashboardLayout from "@/layouts/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ScreenerPage = () => {
  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Stock Screener</CardTitle>
            <CardDescription>
              Screen stocks based on technical indicators and custom criteria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center py-12">Stock Screener page is under development</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ScreenerPage;
