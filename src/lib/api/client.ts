
import axios from 'axios';
import { toast } from 'sonner';
import { checkApiKey } from './config';

// Initialize Axios instance with default configuration
export const api = axios.create({
  baseURL: 'https://api.polygon.io', 
  timeout: 15000, // Increased timeout for reliability
});

// API request wrapper with error handling
export const makeRequest = async <T>(url: string, params: Record<string, any> = {}): Promise<T> => {
  try {
    const apiKey = checkApiKey();
    
    // Debug logs to see what's being sent
    console.log('API Request:', {
      url,
      params: { ...params, apiKey: '****' }
    });

    // Make the request with apiKey properly formatted in the query parameters
    const response = await api.get<T>(url, {
      params: {
        ...params,
        apiKey,
      },
    });

    console.log('API Response Status:', response.status);
    console.log('API Response Headers:', response.headers);
    console.log('API Response Data:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    
    if (axios.isAxiosError(error)) {
      console.error('Axios Error Details:', {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });

      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error('API Key Error: Your API key is invalid or has expired.');
      } else if (error.response?.status === 429) {
        toast.error('Rate limit exceeded. Please try again later.');
      } else {
        toast.error(`API Error: ${error.message}. Check console for details.`);
      }
    } else {
      toast.error('Unexpected error during API request.');
    }
    throw error;
  }
};
