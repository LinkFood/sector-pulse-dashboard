
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useDataSource } from "@/context/DataSourceContext";
import { Badge } from "@/components/ui/badge";

export function MockDataBanner() {
  const { hasMockData, dataSources } = useDataSource();
  
  if (!hasMockData) {
    return null;
  }
  
  // Count how many mock sources we have
  const mockSourceCount = Object.values(dataSources).filter(ds => ds.source === 'mock').length;
  
  return (
    <Alert variant="destructive" className="mb-4 bg-yellow-50 border-yellow-300 text-yellow-800">
      <AlertCircle className="h-4 w-4 text-yellow-600" />
      <AlertTitle className="text-yellow-800">Using Mock Data</AlertTitle>
      <AlertDescription>
        <div className="flex flex-col space-y-2">
          <p>
            The application is currently displaying mock data for {mockSourceCount} data {mockSourceCount === 1 ? 'source' : 'sources'}.
            This may not reflect real market conditions.
          </p>
          <div className="flex flex-wrap gap-2 mt-1">
            {Object.entries(dataSources)
              .filter(([_, info]) => info.source === 'mock')
              .map(([key, info]) => (
                <Badge key={key} variant="outline" className="bg-yellow-100 border-yellow-300 text-yellow-700">
                  {key} {info.endpoint ? `(${info.endpoint})` : ''}
                </Badge>
              ))}
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
}
