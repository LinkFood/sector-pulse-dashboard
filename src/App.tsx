
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from './pages/Index';
import WatchlistPage from './pages/watchlist';
import ApiConfig from './pages/api-config';
import StockDetailsPage from './pages/stock';
import TechnicalAnalysisPage from './pages/technicals';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ProfilePage from './pages/Profile';
import BreadthPage from './pages/breadth';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from './components/ui/sonner';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
          <Route path="/api-config" element={<ApiConfig />} />
          <Route path="/stock/:symbol" element={<StockDetailsPage />} />
          <Route path="/technicals/:symbol" element={<TechnicalAnalysisPage />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/breadth" element={<BreadthPage />} />
        </Routes>
      </Router>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
