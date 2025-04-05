
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SectorPerformance } from "@/lib/api/types";
import { cn } from "@/lib/utils";

interface SectorCorrelationMatrixProps {
  sectors: SectorPerformance[];
}

export function SectorCorrelationMatrix({ sectors }: SectorCorrelationMatrixProps) {
  // Generate mock correlation data
  // In a real implementation, this would be calculated from historical price data
  const generateCorrelationMatrix = () => {
    const matrix: { sector1: string; sector2: string; correlation: number }[] = [];
    
    for (let i = 0; i < sectors.length; i++) {
      for (let j = i + 1; j < sectors.length; j++) {
        // Generate a realistic looking correlation value
        // Based loosely on typical sector correlations
        let baseCorrelation = 0.5; // Mean correlation
        
        // Adjust based on sector pairs
        // Technology and Communication often have higher correlation
        if ((sectors[i].sector === "Technology" && sectors[j].sector === "Communication Services") ||
            (sectors[j].sector === "Technology" && sectors[i].sector === "Communication Services")) {
          baseCorrelation = 0.8;
        }
        
        // Energy and Materials often have higher correlation
        if ((sectors[i].sector === "Energy" && sectors[j].sector === "Materials") ||
            (sectors[j].sector === "Energy" && sectors[i].sector === "Materials")) {
          baseCorrelation = 0.75;
        }
        
        // Utilities and Consumer Staples often have lower correlation with Technology
        if ((sectors[i].sector === "Utilities" && sectors[j].sector === "Technology") ||
            (sectors[j].sector === "Utilities" && sectors[i].sector === "Technology") ||
            (sectors[i].sector === "Consumer Staples" && sectors[j].sector === "Technology") ||
            (sectors[j].sector === "Consumer Staples" && sectors[i].sector === "Technology")) {
          baseCorrelation = 0.2;
        }
        
        // Add some randomness
        const correlation = Math.min(0.99, Math.max(-0.99, baseCorrelation + (Math.random() - 0.5) * 0.4));
        
        matrix.push({
          sector1: sectors[i].sector,
          sector2: sectors[j].sector,
          correlation: Number(correlation.toFixed(2))
        });
      }
    }
    
    // Sort by correlation strength
    return matrix.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation));
  };
  
  const correlationMatrix = generateCorrelationMatrix();
  
  // Get the top correlated and least correlated pairs
  const topCorrelated = correlationMatrix
    .filter(item => item.correlation > 0)
    .slice(0, 5);
  
  const leastCorrelated = [...correlationMatrix]
    .sort((a, b) => a.correlation - b.correlation)
    .slice(0, 5);
  
  // Helper function to get color based on correlation
  const getCorrelationColor = (correlation: number) => {
    const absCorr = Math.abs(correlation);
    
    if (correlation > 0) {
      // Green shades for positive correlation
      if (absCorr > 0.8) return "bg-green-600 text-white";
      if (absCorr > 0.6) return "bg-green-500 text-white";
      if (absCorr > 0.4) return "bg-green-400";
      if (absCorr > 0.2) return "bg-green-300";
      return "bg-green-200";
    } else {
      // Red shades for negative correlation
      if (absCorr > 0.8) return "bg-red-600 text-white";
      if (absCorr > 0.6) return "bg-red-500 text-white";
      if (absCorr > 0.4) return "bg-red-400";
      if (absCorr > 0.2) return "bg-red-300";
      return "bg-red-200";
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sector Correlation Matrix</CardTitle>
        <CardDescription>
          Identify which sectors tend to move together or in opposite directions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-lg mb-2">Highest Positive Correlation</h3>
            <div className="border rounded-md">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-2 text-left">Sector Pair</th>
                    <th className="px-4 py-2 text-right">Correlation</th>
                  </tr>
                </thead>
                <tbody>
                  {topCorrelated.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2">{item.sector1} / {item.sector2}</td>
                      <td className="px-4 py-2">
                        <span className={cn("px-2 py-1 rounded text-xs font-medium", getCorrelationColor(item.correlation))}>
                          {item.correlation}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-2">Lowest/Negative Correlation</h3>
            <div className="border rounded-md">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-2 text-left">Sector Pair</th>
                    <th className="px-4 py-2 text-right">Correlation</th>
                  </tr>
                </thead>
                <tbody>
                  {leastCorrelated.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2">{item.sector1} / {item.sector2}</td>
                      <td className="px-4 py-2">
                        <span className={cn("px-2 py-1 rounded text-xs font-medium", getCorrelationColor(item.correlation))}>
                          {item.correlation}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="font-medium text-lg mb-2">Understanding Correlations</h3>
          <ul className="text-sm space-y-1 list-disc pl-5">
            <li><span className="font-medium">Positive correlation</span> (close to +1): Sectors tend to move in the same direction</li>
            <li><span className="font-medium">Negative correlation</span> (close to -1): Sectors tend to move in opposite directions</li>
            <li><span className="font-medium">Low correlation</span> (close to 0): Sectors move independently of each other</li>
          </ul>
          <p className="text-sm text-muted-foreground mt-2">
            Diversifying across sectors with low or negative correlations can help reduce portfolio volatility.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
