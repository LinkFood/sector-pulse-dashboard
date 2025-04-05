
import React from 'react';
import { useDataSource } from "@/context/DataSourceContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function DataSourceInfo() {
  const { dataSources } = useDataSource();

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString();
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Data Source Information</CardTitle>
      </CardHeader>
      <CardContent className="text-xs">
        <div className="space-y-1">
          {Object.entries(dataSources).length === 0 ? (
            <p className="text-muted-foreground">No data sources registered yet</p>
          ) : (
            <div className="grid grid-cols-3 gap-1">
              <div className="font-medium">Source</div>
              <div className="font-medium">Type</div>
              <div className="font-medium">Last Updated</div>
              
              {Object.entries(dataSources).map(([key, info]) => (
                <React.Fragment key={key}>
                  <div className="truncate" title={info.endpoint || key}>
                    {key}
                  </div>
                  <div>
                    <Badge 
                      variant={info.source === 'api' ? 'default' : 'outline'}
                      className={info.source === 'mock' ? 'bg-yellow-100 border-yellow-300 text-yellow-800' : ''}
                    >
                      {info.source}
                    </Badge>
                  </div>
                  <div>{formatTime(info.timestamp)}</div>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
