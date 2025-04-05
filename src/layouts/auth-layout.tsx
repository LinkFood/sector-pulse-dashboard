
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-muted/40 flex flex-col">
      <header className="px-6 py-4 border-b bg-background">
        <div className="container mx-auto">
          <Link to="/" className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            <span className="font-bold">SectorPulse</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center py-8">
        <div className="w-full">
          {children}
        </div>
      </main>
      <footer className="border-t bg-muted/40 p-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} SectorPulse Dashboard. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Data provided by Polygon.io
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;
