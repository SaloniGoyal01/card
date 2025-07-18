import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Shield, BarChart3, Users, Mic, Settings, LogOut } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "Transactions", href: "/transactions", icon: Shield },
    { name: "Voice Verification", href: "/voice", icon: Mic },
    { name: "Admin Panel", href: "/admin", icon: Users },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-security-50 to-security-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-security-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="relative">
                <Shield className="h-8 w-8 text-security-600" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-pulse" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-security-700 to-security-500 bg-clip-text text-transparent">
                FraudGuard AI
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive(item.href)
                        ? "bg-security-600 text-white shadow-lg shadow-security-600/25"
                        : "text-security-700 hover:bg-security-100 hover:text-security-900"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-security-700 hover:text-security-900"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-security-700 hover:text-security-900"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-security-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-security-600" />
              <span className="text-sm text-security-700">
                © 2024 FraudGuard AI. Real-time fraud detection system.
              </span>
            </div>
            <div className="flex space-x-6 text-sm text-security-600">
              <a href="#" className="hover:text-security-800 transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-security-800 transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-security-800 transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
