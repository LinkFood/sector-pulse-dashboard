
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

export function AppHeader() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
      <SidebarTrigger />
      <div className="flex-1">
        <h1 className="text-xl font-semibold">Sector Pulse Dashboard</h1>
      </div>
      <div className="flex items-center gap-3">
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
        
        {user ? (
          <UserProfileButton />
        ) : (
          <Button asChild variant="default" size="sm">
            <Link to="/auth/login">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
}

export default AppHeader;
