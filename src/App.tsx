
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Import other pages
import SectorsPage from "./pages/sectors";
import VolumePage from "./pages/volume";
import BreadthPage from "./pages/breadth";
import ScreenerPage from "./pages/screener";
import WatchlistPage from "./pages/watchlist";
import TechnicalsPage from "./pages/technicals";
import FiltersPage from "./pages/filters";
import ApiConfigPage from "./pages/api-config";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/sectors" element={<SectorsPage />} />
          <Route path="/volume" element={<VolumePage />} />
          <Route path="/breadth" element={<BreadthPage />} />
          <Route path="/screener" element={<ScreenerPage />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
          <Route path="/technicals" element={<TechnicalsPage />} />
          <Route path="/filters" element={<FiltersPage />} />
          <Route path="/api-config" element={<ApiConfigPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
