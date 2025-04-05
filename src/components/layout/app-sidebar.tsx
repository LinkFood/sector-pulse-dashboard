
import { SidebarNav } from "./sidebar-nav";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { BarChart3, Settings, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

export function AppSidebar() {
  const isMobile = useIsMobile();

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center px-2">
        <div className="flex items-center space-x-2 px-2 py-1">
          <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6" />
          <span className="font-bold text-sm sm:text-base">SectorPulse</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarNav />
      </SidebarContent>
      <SidebarFooter>
        <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
          <Link to="/api-config">
            <Wrench className="mr-2 h-4 w-4" />
            {!isMobile && "API Configuration"}
            {isMobile && <span className="sr-only">API Configuration</span>}
          </Link>
        </Button>
        <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
          <Link to="/settings">
            <Settings className="mr-2 h-4 w-4" />
            {!isMobile && "Settings"}
            {isMobile && <span className="sr-only">Settings</span>}
          </Link>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
