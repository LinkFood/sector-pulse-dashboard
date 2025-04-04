
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Loader } from "lucide-react";
import { getApiKey } from '@/lib/api';
import axios from 'axios';

export function ApiStatusIndicator() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('Checking API connection...');
  
  useEffect(() => {
    const checkApiConnection = async () => {
      const apiKey = getApiKey();
      
      if (!apiKey) {
        setStatus('error');
        setMessage('No API key provided');
        return;
      }
      
      try {
        setStatus('loading');
        const response = await axios.get('https://api.polygon.io/v1/marketstatus/now', {
          params: { apiKey }
        });
        
        if (response.status === 200) {
          setStatus('success');
          setMessage('API connection successful');
        } else {
          setStatus('error');
          setMessage(`API error: ${response.status}`);
        }
      } catch (error) {
        setStatus('error');
        if (axios.isAxiosError(error)) {
          setMessage(`API error: ${error.response?.status || error.message}`);
        } else {
          setMessage('Unknown API error occurred');
        }
      }
    };
    
    checkApiConnection();
    
    // Check connection every 5 minutes
    const interval = setInterval(checkApiConnection, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);
  
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
  
  return (
    <Card className="p-4 mb-6">
      <Alert variant={status === 'error' ? 'destructive' : 'default'}>
        <div className="flex items-center">
          {renderStatusIcon()}
          <div className="ml-2">
            <AlertTitle>Polygon.io API Status</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </div>
        </div>
      </Alert>
    </Card>
  );
}

export default ApiStatusIndicator;
