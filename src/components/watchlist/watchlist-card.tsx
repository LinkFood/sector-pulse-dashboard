
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { WatchlistItem } from "@/lib/api";
import { Plus, Search } from "lucide-react";
import PercentageChange from "@/components/ui/percentage-change";

interface WatchlistCardProps {
  watchlist: WatchlistItem[];
  className?: string;
}

export function WatchlistCard({ watchlist, className }: WatchlistCardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredWatchlist = searchTerm
    ? watchlist.filter(
        item => item.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
               item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : watchlist;

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
          <CardTitle className="text-lg font-semibold">Watchlist</CardTitle>
          <div className="flex w-full sm:w-auto space-x-2">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search symbols..."
                className="pl-8 w-full sm:w-[180px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button size="sm">
              <Plus className="mr-1 h-4 w-4" />
              Add
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWatchlist.length > 0 ? (
                filteredWatchlist.map((item) => (
                  <TableRow key={item.symbol}>
                    <TableCell className="font-medium">{item.symbol}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{item.name}</TableCell>
                    <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <PercentageChange value={item.changePercent} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    {searchTerm ? "No stocks found." : "Your watchlist is empty."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export default WatchlistCard;
