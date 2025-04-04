
import DashboardLayout from "@/layouts/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const TechnicalsPage = () => {
  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Technical Analysis</CardTitle>
            <CardDescription>
              Advanced technical indicators and chart patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center py-12">Technical Analysis page is under development</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TechnicalsPage;
