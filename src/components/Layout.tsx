import { Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Layout() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <div
      className="min-h-screen flex flex-col bg-gradient-to-br from-background via-secondary/20 to-background bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.92)), url(/college-bg.jpg)`,
      }}
    >
      {/* Navbar */}
      <nav className="bg-card/95 backdrop-blur-sm border-b border-border shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-start gap-4">
            {/* Left Side - Logo and Text */}
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-shrink">
              <img
                src="/gbu-logo.png"
                alt="GBU Logo"
                className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 object-contain flex-shrink-0"
              />
              <div className="min-w-0">
                <h1 className="text-sm sm:text-base lg:text-xl font-bold text-foreground truncate">
                  GBU Attendance Portal
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  Gautam Buddha University
                </p>
              </div>
            </div>

            <div className="flex-grow" />

            {/* Right Side - User Info and Logout */}
            {isAuthenticated && user && (
              <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 flex-shrink-0">
                <div className="text-right hidden md:block">
                  <p className="text-sm lg:text-base font-semibold text-foreground">
                    {user.name}
                  </p>
                  <p className="text-xs lg:text-sm text-muted-foreground capitalize">
                    {user.role}
                  </p>
                </div>
                <Button
                  onClick={logout}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm"
                >
                  <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-card/95 backdrop-blur-sm border-t border-border mt-auto">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <p className="text-center text-xs sm:text-sm text-muted-foreground">
            © 2024 Gautam Buddha University | All Rights Reserved
          </p>
        </div>
      </footer>
    </div>
  );
}
