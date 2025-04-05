
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from './pages/Index';
import WatchlistPage from './pages/watchlist';
import ApiConfig from './pages/api-config';
import StockDetailsPage from './pages/stock';
import TechnicalsPage from './pages/technicals';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ProfilePage from './pages/Profile';
import BreadthPage from './pages/breadth';
import VolumePage from './pages/volume';
import SectorsPage from './pages/sectors';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from './components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/watchlist" element={<WatchlistPage />} />
            <Route path="/api-config" element={<ApiConfig />} />
            <Route path="/stock/:symbol" element={<StockDetailsPage />} />
            <Route path="/technicals" element={<TechnicalsPage />} />
            <Route path="/technicals/:symbol" element={<TechnicalsPage />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/signup" element={<Signup />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/breadth" element={<BreadthPage />} />
            <Route path="/volume" element={<VolumePage />} />
            <Route path="/sectors" element={<SectorsPage />} />
          </Routes>
        </Router>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
