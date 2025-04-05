
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, LogIn } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import UserProfileButton from "@/components/auth/UserProfileButton";
import ThemeToggle from "@/components/theme/theme-toggle";
import { useIsMobile } from "@/hooks/use-mobile";

export function AppHeader() {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 z-30 flex h-14 sm:h-16 items-center gap-2 sm:gap-4 border-b bg-background px-3 sm:px-6">
      <SidebarTrigger />
      <div className="flex-1 overflow-hidden">
        <h1 className="text-lg sm:text-xl font-semibold truncate">Sector Pulse Dashboard</h1>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <ThemeToggle />
        
        {!isMobile && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Bell className="h-4 w-4" />
                  <span className="sr-only">Notifications</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Notifications</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        {isMobile && (
          <Button variant="outline" size="icon">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notifications</span>
          </Button>
        )}
        
        {user ? (
          <UserProfileButton />
        ) : (
          <Button asChild variant="default" size={isMobile ? "icon" : "sm"}>
            <Link to="/login">
              {isMobile ? (
                <LogIn className="h-4 w-4" />
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </>
              )}
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
}

export default AppHeader;
