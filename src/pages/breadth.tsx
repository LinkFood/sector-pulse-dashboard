
import DashboardLayout from "@/layouts/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const BreadthPage = () => {
  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Market Breadth Dashboard</CardTitle>
            <CardDescription>
              View advanced indicators of overall market health
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center py-12">Market Breadth Dashboard is under development</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default BreadthPage;
