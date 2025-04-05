
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Import pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SectorsPage from "./pages/sectors";
import VolumePage from "./pages/volume";
import BreadthPage from "./pages/breadth";
import ScreenerPage from "./pages/screener";
import WatchlistPage from "./pages/watchlist";
import TechnicalsPage from "./pages/technicals";
import FiltersPage from "./pages/filters";
import ApiConfigPage from "./pages/api-config";
import ProfilePage from "./pages/Profile";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" closeButton={true} richColors={true} />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Auth routes */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/signup" element={<Signup />} />
            
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/sectors" element={
              <ProtectedRoute>
                <SectorsPage />
              </ProtectedRoute>
            } />
            <Route path="/volume" element={
              <ProtectedRoute>
                <VolumePage />
              </ProtectedRoute>
            } />
            <Route path="/breadth" element={
              <ProtectedRoute>
                <BreadthPage />
              </ProtectedRoute>
            } />
            <Route path="/screener" element={
              <ProtectedRoute>
                <ScreenerPage />
              </ProtectedRoute>
            } />
            <Route path="/watchlist" element={
              <ProtectedRoute>
                <WatchlistPage />
              </ProtectedRoute>
            } />
            <Route path="/technicals" element={
              <ProtectedRoute>
                <TechnicalsPage />
              </ProtectedRoute>
            } />
            <Route path="/filters" element={
              <ProtectedRoute>
                <FiltersPage />
              </ProtectedRoute>
            } />
            <Route path="/api-config" element={
              <ProtectedRoute>
                <ApiConfigPage />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />

            {/* Catch all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
