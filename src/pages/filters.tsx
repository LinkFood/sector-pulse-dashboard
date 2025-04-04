
import DashboardLayout from "@/layouts/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const FiltersPage = () => {
  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Custom Filters</CardTitle>
            <CardDescription>
              Create and manage your custom stock filters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center py-12">Custom Filters page is under development</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default FiltersPage;
