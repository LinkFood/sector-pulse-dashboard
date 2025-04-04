
import React from 'react';
import { supabase } from "@/integrations/supabase/client";

export const DebugInfo: React.FC = () => {
  const [status, setStatus] = React.useState<string>("Checking connection...");

  React.useEffect(() => {
    const checkConnection = async () => {
      try {
        // Just call a simple method to verify the connection works
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Supabase connection error:", error);
          setStatus(`Connection error: ${error.message}`);
        } else {
          console.log("Supabase connection successful", data);
          setStatus("Supabase connection successful");
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setStatus(`Unexpected error: ${err instanceof Error ? err.message : String(err)}`);
      }
    };

    checkConnection();
  }, []);

  return (
    <div className="p-4 bg-gray-100 rounded-lg mb-4">
      <h3 className="font-medium text-gray-800">Debug Information</h3>
      <p className="text-sm text-gray-600">Supabase Status: {status}</p>
    </div>
  );
};

export default DebugInfo;
