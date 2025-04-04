
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarketIndex } from "@/lib/api";
import PercentageChange from "@/components/ui/percentage-change";

interface MarketIndicesCardProps {
  indices: MarketIndex[];
  className?: string;
}

export function MarketIndicesCard({ indices, className }: MarketIndicesCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Market Indices</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {indices.map((index) => (
            <div key={index.ticker} className="flex flex-col space-y-1">
              <span className="text-sm font-medium">{index.name}</span>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-semibold">
                  {index.value.toLocaleString('en-US', { 
                    maximumFractionDigits: 2 
                  })}
                </span>
                <PercentageChange value={index.changePercent} />
              </div>
              <span className="text-xs text-muted-foreground">
                {index.change > 0 ? '+' : ''}
                {index.change.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default MarketIndicesCard;
