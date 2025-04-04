
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Loader, RefreshCcw } from "lucide-react";
import { getApiKey, setApiKey } from "@/lib/api";
import axios from 'axios';

const ApiConfigPage = () => {
  const [apiKey, setApiKeyState] = useState(getApiKey());
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('Checking API connection...');
  const { toast } = useToast();

  useEffect(() => {
    // Check if API key is already stored
    const storedKey = getApiKey();
    if (storedKey) {
      setApiKeyState(storedKey);
      checkApiConnection(storedKey);
    }
  }, []);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = e.target.value;
    setApiKeyState(newKey);
    setIsValid(null); // Reset validation state
  };

  const checkApiConnection = async (key: string) => {
    if (!key) {
      setStatus('error');
      setMessage('No API key provided');
      return false;
    }
    
    try {
      setStatus('loading');
      setMessage('Checking API connection...');
      
      const response = await axios.get('https://api.polygon.io/v1/marketstatus/now', {
        params: { apiKey: key }
      });
      
      if (response.status === 200) {
        setStatus('success');
        setMessage('API connection successful');
        return true;
      } else {
        setStatus('error');
        setMessage(`API error: ${response.status}`);
        return false;
      }
    } catch (error) {
      setStatus('error');
      if (axios.isAxiosError(error)) {
        setMessage(`API error: ${error.response?.status || error.message}`);
      } else {
        setMessage('Unknown API error occurred');
      }
      return false;
    }
  };
  
  const saveApiKey = async () => {
    setIsValidating(true);
    
    try {
      // Test the API connection before saving
      const isConnectionValid = await checkApiConnection(apiKey);
      
      if (isConnectionValid) {
        // Store the API key
        setApiKey(apiKey);
        setIsValid(true);
        
        toast({
          title: "API Key Saved",
          description: "Your Polygon.io API key has been saved and verified.",
        });
      } else {
        setIsValid(false);
        toast({
          title: "API Key Error",
          description: "The API key could not be validated with Polygon.io.",
          variant: "destructive",
        });
      }
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

  const renderStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Loader className="h-5 w-5 text-blue-500 animate-spin" />;
    }
  };

  const handleManualCheck = () => {
    checkApiConnection(apiKey);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">API Configuration</h1>
        </div>

        <Tabs defaultValue="settings" className="w-full">
          <TabsList>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="status">Connection Status</TabsTrigger>
            <TabsTrigger value="documentation">Documentation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="settings" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Polygon.io API Configuration</CardTitle>
                <CardDescription>
                  Configure your Polygon.io API key to access stock market data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="api-key">API Key</label>
                  <div className="flex gap-2">
                    <Input
                      id="api-key"
                      type="password"
                      value={apiKey}
                      onChange={handleApiKeyChange}
                      placeholder="Enter your Polygon.io API key"
                    />
                    <Button onClick={saveApiKey} disabled={isValidating || !apiKey}>
                      {isValidating ? <Loader className="h-4 w-4 mr-2 animate-spin" /> : null}
                      Save & Verify
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your API key will be stored in your browser's local storage
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                  Don't have an API key? <a href="https://polygon.io/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Sign up at Polygon.io</a>
                </div>
                <div className="flex items-center">
                  {isValid === true && <CheckCircle className="h-4 w-4 text-green-500 mr-2" />}
                  {isValid === false && <AlertCircle className="h-4 w-4 text-red-500 mr-2" />}
                  <span className="text-sm">
                    {isValid === true && "API key verified"}
                    {isValid === false && "API key invalid"}
                    {isValid === null && ""}
                  </span>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="status" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>API Connection Status</CardTitle>
                <CardDescription>
                  Check the current status of your Polygon.io API connection
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert variant={status === 'error' ? 'destructive' : 'default'}>
                  <div className="flex items-center">
                    {renderStatusIcon()}
                    <div className="ml-2">
                      <AlertTitle>Polygon.io API</AlertTitle>
                      <AlertDescription>{message}</AlertDescription>
                    </div>
                  </div>
                </Alert>
                
                <div className="flex justify-end">
                  <Button variant="outline" onClick={handleManualCheck} className="flex items-center">
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Check Connection
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="documentation" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>API Documentation</CardTitle>
                <CardDescription>
                  Learn how to use the Polygon.io API
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose max-w-none">
                  <h3>About Polygon.io</h3>
                  <p>
                    Polygon.io provides real-time and historical market data for stocks, options, forex, and crypto markets.
                    This application uses the Polygon.io API to provide market data insights.
                  </p>
                  
                  <h3>Key Endpoints Used</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><code>/v1/marketstatus/now</code> - Current market status</li>
                    <li><code>/v2/snapshot/tickers</code> - Current snapshot of ticker data</li>
                  </ul>
                  
                  <h3>API Limits</h3>
                  <p>
                    Depending on your Polygon.io subscription plan, you may have limits on the number of API calls you can make.
                    Check your <a href="https://polygon.io/dashboard" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Polygon.io dashboard</a> for details.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <a href="https://polygon.io/docs" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  View Full API Documentation →
                </a>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ApiConfigPage;
