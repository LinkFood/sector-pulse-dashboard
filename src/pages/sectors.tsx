
import DashboardLayout from "@/layouts/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const SectorsPage = () => {
  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sector Analysis</CardTitle>
            <CardDescription>
              Detailed analysis of market sectors and their performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center py-12">Sector Analysis page is under development</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SectorsPage;
