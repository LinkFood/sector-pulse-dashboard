
import { Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { createOptimizedQueryClient } from './lib/api/cache';
import { AuthProvider } from './context/AuthContext';
import { WatchlistProvider } from './contexts/WatchlistContext';
import { DataSourceProvider } from './context/DataSourceContext';
import { Toaster } from './components/ui/sonner';
import HomePage from './pages/Index';
import StockPage from './pages/stock';
import NotFoundPage from './pages/NotFound';
import FilterPage from './pages/filters';
import SectorsPage from './pages/sectors';
import BreadthPage from './pages/breadth';
import ScreenerPage from './pages/screener';
import TechnicalsPage from './pages/technicals';
import WatchlistPage from './pages/watchlist';
import VolumePage from './pages/volume';
import ProfilePage from './pages/Profile';
import ApiConfigPage from './pages/api-config';
import LoginPage from './pages/auth/Login';
import SignupPage from './pages/auth/Signup';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  const queryClient = createOptimizedQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <WatchlistProvider>
        <DataSourceProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/stock/:symbol" element={<StockPage />} />
            <Route path="/sectors" element={<SectorsPage />} />
            <Route path="/breadth" element={<BreadthPage />} />
            <Route path="/filters" element={<FilterPage />} />
            <Route path="/screener" element={<ScreenerPage />} />
            <Route path="/technicals" element={<TechnicalsPage />} />
            <Route path="/volume" element={<VolumePage />} />
            <Route 
              path="/watchlist" 
              element={
                <ProtectedRoute>
                  <WatchlistPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            <Route path="/api-config" element={<ApiConfigPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Toaster />
        </DataSourceProvider>
      </WatchlistProvider>
    </QueryClientProvider>
  );
}

export default App;
