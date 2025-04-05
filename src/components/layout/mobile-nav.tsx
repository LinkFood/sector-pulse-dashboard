
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger, 
  SheetClose
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Home,
  LineChart,
  ListFilter,
  Menu,
  PieChart,
  Search,
  Star,
  Activity,
  Shield,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export function MobileNav() {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  if (!isMobile) return null;

  const navItems = [
    {
      href: "/",
      title: "Dashboard",
      icon: Home,
    },
    {
      href: "/sectors",
      title: "Sector Analysis",
      icon: PieChart,
    },
    {
      href: "/volume",
      title: "Volume Profile",
      icon: BarChart3,
    },
    {
      href: "/breadth",
      title: "Market Breadth",
      icon: Activity,
    },
    {
      href: "/screener",
      title: "Stock Screener",
      icon: Search,
    },
    {
      href: "/watchlist",
      title: "Watchlist",
      icon: Star,
    },
    {
      href: "/technicals",
      title: "Technical Analysis",
      icon: LineChart,
    },
    {
      href: "/filters",
      title: "Custom Filters",
      icon: ListFilter,
    },
    {
      href: "/api-config",
      title: "API Configuration",
      icon: Shield,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t md:hidden">
      <div className="grid h-full grid-cols-5">
        {navItems.slice(0, 4).map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex flex-col items-center justify-center px-2",
              "transition-colors duration-200 ease-in-out",
              location.pathname === item.href
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-[10px] mt-1 truncate">{item.title}</span>
          </Link>
        ))}

        <Sheet>
          <SheetTrigger asChild>
            <button className="flex flex-col items-center justify-center px-2">
              <Menu className="h-5 w-5" />
              <span className="text-[10px] mt-1">More</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[70vh] pt-10">
            <div className="grid grid-cols-3 gap-4 p-4">
              {navItems.slice(4).map((item) => (
                <SheetClose asChild key={item.href}>
                  <Link
                    to={item.href}
                    className="flex flex-col items-center justify-center p-4 rounded-lg border hover:bg-accent"
                  >
                    <item.icon className="h-6 w-6 mb-2" />
                    <span className="text-xs text-center">{item.title}</span>
                  </Link>
                </SheetClose>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

// Utility function to conditionally join class names
const cn = (...classes: any[]) => {
  return classes.filter(Boolean).join(' ');
};

export default MobileNav;
