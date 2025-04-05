
import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PercentageChange from "@/components/ui/percentage-change";

interface SectorIndustryBreakdownProps {
  activeSector: string;
}

interface IndustryData {
  name: string;
  value: number;
  marketCap: number;
  performance: number;
}

const COLORS = ['#22C55E', '#10B981', '#0EA5E9', '#8B5CF6', '#EC4899', '#F43F5E', '#F59E0B', '#0D9488', '#6366F1', '#6b7280'];

const SectorIndustryBreakdown: React.FC<SectorIndustryBreakdownProps> = ({ activeSector }) => {
  const [selectedSector, setSelectedSector] = useState<string>(activeSector || "Technology");
  
  // Mock data - would be replaced with API call
  const sectors = [
    "Technology",
    "Healthcare",
    "Financials",
    "Communication Services",
    "Consumer Discretionary",
    "Consumer Staples",
    "Energy",
    "Industrials",
    "Materials",
    "Real Estate",
    "Utilities"
  ];
  
  const getIndustryData = (sector: string): IndustryData[] => {
    switch(sector) {
      case "Technology":
        return [
          { name: "Software", value: 35, marketCap: 3200, performance: 2.8 },
          { name: "Hardware", value: 20, marketCap: 1800, performance: 1.2 },
          { name: "Semiconductors", value: 25, marketCap: 2100, performance: 3.5 },
          { name: "IT Services", value: 15, marketCap: 1500, performance: 0.9 },
          { name: "Electronic Equipment", value: 5, marketCap: 400, performance: -0.3 }
        ];
      case "Healthcare":
        return [
          { name: "Pharmaceuticals", value: 40, marketCap: 1900, performance: 0.7 },
          { name: "Medical Devices", value: 25, marketCap: 1200, performance: 1.4 },
          { name: "Healthcare Providers", value: 20, marketCap: 950, performance: -0.2 },
          { name: "Biotechnology", value: 15, marketCap: 850, performance: 2.1 }
        ];
      case "Financials":
        return [
          { name: "Banks", value: 40, marketCap: 2200, performance: -0.8 },
          { name: "Insurance", value: 25, marketCap: 1400, performance: -0.3 },
          { name: "Capital Markets", value: 20, marketCap: 1100, performance: 0.5 },
          { name: "Consumer Finance", value: 10, marketCap: 600, performance: -1.2 },
          { name: "Diversified Financial", value: 5, marketCap: 300, performance: -0.2 }
        ];
      // Additional sectors would be added here
      default:
        return [
          { name: "Industry 1", value: 30, marketCap: 1500, performance: 1.2 },
          { name: "Industry 2", value: 25, marketCap: 1200, performance: -0.8 },
          { name: "Industry 3", value: 20, marketCap: 1000, performance: 0.5 },
          { name: "Industry 4", value: 15, marketCap: 800, performance: -0.3 },
          { name: "Industry 5", value: 10, marketCap: 500, performance: 2.1 }
        ];
    }
  };
  
  const industryData = getIndustryData(selectedSector);
  
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Industry Breakdown</CardTitle>
            <CardDescription>Distribution and performance by industry group</CardDescription>
          </div>
          <div className="mt-2 sm:mt-0 w-full max-w-xs">
            <Select value={selectedSector} onValueChange={setSelectedSector}>
              <SelectTrigger>
                <SelectValue placeholder="Select a sector" />
              </SelectTrigger>
              <SelectContent>
                {sectors.map((sector) => (
                  <SelectItem key={sector} value={sector}>
                    {sector}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={industryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {industryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name, props) => [`${value}%`, props.payload.name]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="h-80 overflow-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Industry</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Weight</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Performance</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                {industryData.map((industry, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{industry.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{industry.value}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <PercentageChange value={industry.performance} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SectorIndustryBreakdown;
