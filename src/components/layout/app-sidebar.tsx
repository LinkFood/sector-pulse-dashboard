
import { useState, useEffect } from "react";
import { SidebarNav } from "./sidebar-nav";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { BarChart3, Settings, Info, Check, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getApiKey, setApiKey } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

export function AppSidebar() {
  const [apiKey, setApiKeyState] = useState(getApiKey());
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if API key is already stored
    const storedKey = getApiKey();
    if (storedKey) {
      setApiKeyState(storedKey);
    }
  }, []);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = e.target.value;
    setApiKeyState(newKey);
    setIsValid(null); // Reset validation state
  };

  const handleApiKeyBlur = () => {
    if (apiKey) {
      saveApiKey();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && apiKey) {
      saveApiKey();
    }
  };
  
  const saveApiKey = async () => {
    setIsValidating(true);
    
    try {
      // Store the API key
      setApiKey(apiKey);
      
      // We don't actually validate the key here because that would require an API call
      // In a real app, you'd make a test API call to validate
      setIsValid(true);
      toast({
        title: "API Key Saved",
        description: "Your Polygon.io API key has been saved.",
      });
    } catch (error) {
      setIsValid(false);
      console.error("Error saving API key:", error);
      toast({
        title: "Error",
        description: "Failed to save API key",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
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
            <div className="flex items-center justify-between text-xs text-sidebar-foreground/70 mb-1">
              <div className="flex items-center space-x-1">
                <Info className="h-3 w-3" />
                <span>Polygon.io API Key</span>
              </div>
              {isValid === true && <Check className="h-3 w-3 text-green-500" />}
              {isValid === false && <AlertCircle className="h-3 w-3 text-red-500" />}
            </div>
            <div className="relative">
              <Input
                value={apiKey}
                onChange={handleApiKeyChange}
                onBlur={handleApiKeyBlur}
                onKeyPress={handleKeyPress}
                className="h-8 text-xs pr-16"
                placeholder="Enter your API key..."
                type="password"
              />
              <Button 
                size="sm" 
                className="absolute right-0 top-0 h-8 text-xs rounded-l-none"
                onClick={saveApiKey}
                disabled={isValidating || !apiKey}
              >
                Save
              </Button>
            </div>
            <p className="mt-1 text-[10px] text-muted-foreground">
              {!apiKey ? "Please enter your Polygon.io API key to fetch real market data" : 
                "API key will be stored in your browser's local storage"}
            </p>
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
