
// API key management

// Placeholder for API key - would come from environment variables in production
let API_KEY = '';

export const setApiKey = (key: string) => {
  API_KEY = key;
  localStorage.setItem('polygon_api_key', key);
};

export const getApiKey = (): string => {
  if (!API_KEY) {
    API_KEY = localStorage.getItem('polygon_api_key') || '';
  }
  return API_KEY;
};

// Helper to ensure API key is available
export const checkApiKey = () => {
  const key = getApiKey();
  if (!key) {
    throw new Error('API key not configured');
  }
  return key;
};
