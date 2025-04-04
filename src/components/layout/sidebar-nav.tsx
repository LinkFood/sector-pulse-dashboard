
import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Home,
  LineChart,
  ListFilter,
  PieChart,
  Search,
  Star,
  Activity,
} from "lucide-react";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items?: {
    href: string;
    title: string;
    icon: React.ElementType;
  }[];
}

export function SidebarNav({
  className,
  items,
  ...props
}: SidebarNavProps) {
  const location = useLocation();
  
  const defaultItems = [
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
  ];

  const navItems = items || defaultItems;

  return (
    <nav className={cn("flex flex-col space-y-1", className)} {...props}>
      {navItems.map((item) => (
        <Button
          key={item.href}
          variant="ghost"
          className={cn(
            "justify-start",
            location.pathname === item.href
              ? "bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/90 hover:text-sidebar-accent-foreground"
              : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
          )}
          asChild
        >
          <Link to={item.href}>
            <item.icon className="mr-2 h-4 w-4" />
            {item.title}
          </Link>
        </Button>
      ))}
    </nav>
  );
}

export default SidebarNav;
