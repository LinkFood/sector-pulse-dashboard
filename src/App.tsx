
import React from "react";
import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Profile from "@/pages/Profile";
import Technicals from "@/pages/technicals";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";
import ApiConfig from "@/pages/api-config";
import Volume from "@/pages/volume";
import { ThemeProvider } from "@/context/ThemeContext";
import Breadth from "@/pages/breadth";
import Watchlist from "@/pages/watchlist";
import Stock from "@/pages/stock";
import Sectors from "@/pages/sectors";
import Screener from "@/pages/screener";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/technicals" element={<Technicals />} />
        <Route path="/volume" element={<Volume />} />
        <Route path="/breadth" element={<Breadth />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/stock/:symbol" element={<Stock />} />
        <Route path="/sectors" element={<Sectors />} />
        <Route path="/screener" element={<Screener />} />
        
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Signup />} />
        
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/api-config" element={<ApiConfig />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
