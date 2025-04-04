
import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { MarketStatusIndicator } from "@/components/layout/market-status";
import { ApiStatusIndicator } from "@/components/layout/api-status";
import {
  Sidebar,
  SidebarProvider,
} from "@/components/ui/sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <div className="flex w-full flex-1 flex-col">
          <AppHeader />
          <main className="flex-1 overflow-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Market Overview</h2>
              <MarketStatusIndicator />
            </div>
            <ApiStatusIndicator />
            {children}
          </main>
          <footer className="border-t bg-muted/40 p-4">
            <div className="mx-auto flex max-w-7xl items-center justify-between">
              <p className="text-xs text-muted-foreground">
                &copy; {new Date().getFullYear()} SectorPulse Dashboard. All rights reserved.
              </p>
              <p className="text-xs text-muted-foreground">
                Data provided by Polygon.io
              </p>
            </div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default DashboardLayout;
