
import React from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/context/AuthContext';

export const DebugInfo: React.FC = () => {
  const [status, setStatus] = React.useState<string>("Checking connection...");
  const { user } = useAuth();

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
      <div className="text-sm text-gray-600">
        <p>Supabase Status: {status}</p>
        {user && (
          <div className="mt-2">
            <p>User: {user.email}</p>
            <p>Auth Status: Logged In</p>
            <p>User ID: {user.id.substring(0, 8)}...</p>
          </div>
        )}
        {!user && <p className="mt-2">Auth Status: Not Logged In</p>}
      </div>
    </div>
  );
};

export default DebugInfo;
