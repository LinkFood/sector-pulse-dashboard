
import { useState } from "react";
import { SidebarNav } from "./sidebar-nav";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { BarChart3, Settings, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getApiKey, setApiKey } from "@/lib/api";

export function AppSidebar() {
  const [apiKey, setApiKeyState] = useState(getApiKey());

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = e.target.value;
    setApiKeyState(newKey);
    setApiKey(newKey);
  };

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
        <div className="mt-4 px-4 py-2">
          <div className="mb-2">
            <div className="flex items-center space-x-1 text-xs text-sidebar-foreground/70 mb-1">
              <Info className="h-3 w-3" />
              <span>Polygon.io API Key</span>
            </div>
            <Input
              value={apiKey}
              onChange={handleApiKeyChange}
              className="h-8 text-xs"
              placeholder="Enter your API key..."
              type="password"
            />
          </div>
        </div>
      </SidebarContent>
      <SidebarFooter>
        <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
          <a href="#">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </a>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
