
import React, { createContext, useContext, useState, ReactNode } from 'react';

type DataSource = 'api' | 'mock' | 'unknown';

interface DataSourceInfo {
  source: DataSource;
  timestamp: Date;
  endpoint?: string;
}

interface DataSourceContextValue {
  dataSources: Record<string, DataSourceInfo>;
  registerDataSource: (key: string, source: DataSource, endpoint?: string) => void;
  getDataSource: (key: string) => DataSourceInfo | undefined;
  hasMockData: boolean;
}

const DataSourceContext = createContext<DataSourceContextValue | undefined>(undefined);

export function DataSourceProvider({ children }: { children: ReactNode }) {
  const [dataSources, setDataSources] = useState<Record<string, DataSourceInfo>>({});

  const registerDataSource = (key: string, source: DataSource, endpoint?: string) => {
    setDataSources(prev => ({
      ...prev,
      [key]: {
        source,
        timestamp: new Date(),
        endpoint
      }
    }));
  };

  const getDataSource = (key: string) => {
    return dataSources[key];
  };

  // Calculate if any mock data is being used
  const hasMockData = Object.values(dataSources).some(
    info => info.source === 'mock'
  );

  return (
    <DataSourceContext.Provider value={{ 
      dataSources, 
      registerDataSource, 
      getDataSource,
      hasMockData
    }}>
      {children}
    </DataSourceContext.Provider>
  );
}

export function useDataSource() {
  const context = useContext(DataSourceContext);
  
  if (context === undefined) {
    throw new Error('useDataSource must be used within a DataSourceProvider');
  }
  
  return context;
}
