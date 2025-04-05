
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/dashboard-layout";
import StockDetailsCard from "@/components/watchlist/stock-details-card";

const StockDetailsPage = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate(-1);
  };
  
  return (
    <DashboardLayout>
      <div className="grid gap-6">
        {symbol ? (
          <StockDetailsCard symbol={symbol} onBack={handleBack} />
        ) : (
          <div className="text-center p-8">
            <h2 className="text-2xl font-semibold mb-4">Stock not found</h2>
            <p className="text-muted-foreground">
              Please select a valid stock symbol.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StockDetailsPage;
