import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from './pages/Index';
import WatchlistPage from './pages/watchlist';
import ApiConfig from './pages/api-config';
import StockDetailsPage from './pages/stock';
import TechnicalAnalysisPage from './pages/technicals';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/watchlist" element={<WatchlistPage />} />
        <Route path="/api-config" element={<ApiConfig />} />
        <Route path="/stock/:symbol" element={<StockDetailsPage />} />
        <Route path="/technicals/:symbol" element={<TechnicalAnalysisPage />} />
      </Routes>
    </Router>
  );
}

export default App;
