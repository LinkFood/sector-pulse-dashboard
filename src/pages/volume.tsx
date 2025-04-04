
import DashboardLayout from "@/layouts/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const VolumePage = () => {
  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Volume Profile Analysis</CardTitle>
            <CardDescription>
              Analyze trading volume patterns at key price levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center py-12">Volume Profile Analysis page is under development</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default VolumePage;
