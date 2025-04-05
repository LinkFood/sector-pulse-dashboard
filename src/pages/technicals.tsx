
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StockSymbolSearch from "@/components/market/stock-symbol-search";
import TechnicalChart from "@/components/technicals/technical-chart";
import IndicatorSelector from "@/components/technicals/indicator-selector";
import TimeframeSelector from "@/components/breadth/timeframe-selector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { fetchAggregateData } from "@/lib/api/volume";
import { calculateIndicators } from "@/lib/technicals/indicators";

const TechnicalsPage = () => {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const [selectedTimeframe, setSelectedTimeframe] = useState("1M");
  const [activeIndicators, setActiveIndicators] = useState<string[]>(["sma"]);
  const [stockSymbol, setStockSymbol] = useState(symbol || "AAPL");

  // Fetch stock data
  const { data: stockData, isLoading } = useQuery({
    queryKey: ["technicalData", stockSymbol, selectedTimeframe],
    queryFn: () => fetchAggregateData(stockSymbol, selectedTimeframe),
    enabled: !!stockSymbol,
  });

  // Process indicators
  const processedData = stockData?.results 
    ? calculateIndicators(stockData.results, activeIndicators) 
    : [];
    
  // Handle symbol search
  const handleSymbolSearch = (symbol: string) => {
    setStockSymbol(symbol);
    // Update URL to include the symbol for bookmarking/sharing
    navigate(`/technicals/${symbol}`);
  };

  // Handle indicator toggle
  const handleIndicatorToggle = (indicator: string) => {
    setActiveIndicators(prev => 
      prev.includes(indicator) 
        ? prev.filter(i => i !== indicator) 
        : [...prev, indicator]
    );
  };

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Technical Analysis</CardTitle>
                <CardDescription>
                  Advanced technical indicators and chart patterns
                </CardDescription>
              </div>
              <StockSymbolSearch onSearch={handleSymbolSearch} isLoading={isLoading} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <TimeframeSelector 
                  selectedTimeframe={selectedTimeframe}
                  onTimeframeChange={setSelectedTimeframe}
                />
                <IndicatorSelector 
                  activeIndicators={activeIndicators} 
                  onToggle={handleIndicatorToggle}
                />
              </div>
              
              <Tabs defaultValue="candlestick">
                <TabsList>
                  <TabsTrigger value="candlestick">Candlestick</TabsTrigger>
                  <TabsTrigger value="line">Line</TabsTrigger>
                  <TabsTrigger value="area">Area</TabsTrigger>
                </TabsList>
                <TabsContent value="candlestick" className="mt-4">
                  <TechnicalChart 
                    data={processedData} 
                    isLoading={isLoading}
                    activeIndicators={activeIndicators}
                    chartType="candlestick"
                  />
                </TabsContent>
                <TabsContent value="line" className="mt-4">
                  <TechnicalChart 
                    data={processedData} 
                    isLoading={isLoading}
                    activeIndicators={activeIndicators}
                    chartType="line"
                  />
                </TabsContent>
                <TabsContent value="area" className="mt-4">
                  <TechnicalChart 
                    data={processedData} 
                    isLoading={isLoading}
                    activeIndicators={activeIndicators}
                    chartType="area"
                  />
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TechnicalsPage;
