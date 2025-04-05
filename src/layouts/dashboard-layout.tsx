
import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { MarketStatusIndicator } from "@/components/layout/market-status";
import {
  Sidebar,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <div className="flex w-full flex-1 flex-col">
          <AppHeader />
          <main className="flex-1 overflow-auto p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2">
              <h2 className="text-xl sm:text-2xl font-semibold">Market Overview</h2>
              <MarketStatusIndicator />
            </div>
            {children}
          </main>
          <footer className="border-t bg-muted/40 p-2 sm:p-4">
            <div className="mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0 text-center sm:text-left">
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
