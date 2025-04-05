
import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { debounce } from 'lodash';
import DashboardLayout from "@/layouts/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import FilterSection from "@/components/screener/FilterSection";
import ResultsTable from "@/components/screener/ResultsTable";
import SavedScreens from "@/components/screener/SavedScreens";
import { fetchScreenerResults, ScreenerParams } from "@/lib/api/screener";
import { getApiKey } from "@/lib/api/config";

const ScreenerPage = () => {
  // Check for API key
  const hasApiKey = !!getApiKey();
  
  // State for current filters
  const [currentFilters, setCurrentFilters] = useState<ScreenerParams>({
    limit: 20,
    page: 1,
    sortBy: 'ticker',
    sortDirection: 'asc',
  });

  // Debounced filter change function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFilterChange = useCallback(
    debounce((filters: ScreenerParams) => {
      setCurrentFilters(filters);
    }, 500),
    []
  );

  // Fetch screener results
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['screenerResults', currentFilters],
    queryFn: () => fetchScreenerResults(currentFilters),
    enabled: hasApiKey,
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    meta: {
      onError: (err: any) => {
        console.error('Error fetching screener results:', err);
        toast.error('Failed to fetch stocks. Please check your filters and try again.');
      }
    }
  });

  // Handle filter changes
  const handleFilterChange = (filters: ScreenerParams) => {
    // Reset to page 1 when changing filters
    const updatedFilters = { ...filters, page: 1 };
    setCurrentFilters(updatedFilters);
  };

  // Handle sort changes
  const handleSortChange = (sortBy: string, direction: 'asc' | 'desc') => {
    setCurrentFilters(prev => ({
      ...prev,
      sortBy,
      sortDirection: direction
    }));
  };

  // Handle page changes
  const handlePageChange = (page: number) => {
    setCurrentFilters(prev => ({
      ...prev,
      page
    }));
  };

  // Load saved template
  const handleLoadTemplate = (filters: ScreenerParams) => {
    setCurrentFilters(filters);
  };

  // If there's an error, show it in the UI
  if (error) {
    console.error('Error in screener page:', error);
  }

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Stock Screener</CardTitle>
            <CardDescription>
              Screen stocks based on technical indicators and custom criteria
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!hasApiKey ? (
              <div className="text-center py-6">
                <p className="text-lg font-medium">API Key Required</p>
                <p className="text-muted-foreground mt-2">
                  To use the Stock Screener, please configure your Polygon.io API key in the API Configuration page.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                  <div className="xl:col-span-3">
                    <FilterSection
                      onFilterChange={handleFilterChange}
                      isLoading={isLoading}
                    />
                  </div>
                  <div className="xl:col-span-1">
                    <SavedScreens
                      currentFilters={currentFilters}
                      onLoadTemplate={handleLoadTemplate}
                    />
                  </div>
                </div>

                {error ? (
                  <Card>
                    <CardContent className="text-center py-6 text-red-500">
                      <p className="font-semibold">Error loading stock data</p>
                      <p className="text-sm mt-2">
                        There was a problem fetching stock data from the API.
                        Please check your filters and try again.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <ResultsTable
                    data={data || []}
                    isLoading={isLoading}
                    totalResults={data?.length || 0}
                    currentFilters={currentFilters}
                    onSortChange={handleSortChange}
                    onPageChange={handlePageChange}
                  />
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ScreenerPage;
