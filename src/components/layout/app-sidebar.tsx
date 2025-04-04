
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

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="flex items-center px-2">
        <div className="flex items-center space-x-2 px-2">
          <BarChart3 className="h-6 w-6" />
          <span className="font-bold">SectorPulse</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarNav />
      </SidebarContent>
      <SidebarFooter>
        <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
          <Link to="/api-config">
            <Wrench className="mr-2 h-4 w-4" />
            API Configuration
          </Link>
        </Button>
        <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
          <Link to="/settings">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
