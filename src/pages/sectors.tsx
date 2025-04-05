
import DashboardLayout from "@/layouts/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

const SectorsPage = () => {
  const isMobile = useIsMobile();
  
  return (
    <DashboardLayout>
      <div className="grid gap-4 sm:gap-6">
        <Card>
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-lg sm:text-xl">Sector Analysis</CardTitle>
            <CardDescription className="text-sm">
              Detailed analysis of market sectors and their performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center py-8 sm:py-12">Sector Analysis page is under development</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SectorsPage;
