
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LineChart, ChevronDown } from "lucide-react";

interface IndicatorSelectorProps {
  activeIndicators: string[];
  onToggle: (indicator: string) => void;
}

const INDICATORS = [
  { id: "sma", label: "Simple Moving Average (SMA)" },
  { id: "ema", label: "Exponential Moving Average (EMA)" },
  { id: "bollinger", label: "Bollinger Bands" },
  { id: "macd", label: "MACD" },
  { id: "rsi", label: "Relative Strength Index (RSI)" },
];

const IndicatorSelector: React.FC<IndicatorSelectorProps> = ({ activeIndicators, onToggle }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center">
          <LineChart className="w-4 h-4 mr-2" />
          Indicators
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Technical Indicators</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {INDICATORS.map((indicator) => (
          <DropdownMenuCheckboxItem
            key={indicator.id}
            checked={activeIndicators.includes(indicator.id)}
            onCheckedChange={() => onToggle(indicator.id)}
          >
            {indicator.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default IndicatorSelector;
