import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Eye, History, LogOut, Home, User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
  showNav?: boolean;
}

export function Layout({ children, showNav = true }: LayoutProps) {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: Home, label: "Dashboard" },
    { href: "/screen", icon: Eye, label: "Screen" },
    { href: "/history", icon: History, label: "History" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Mobile-first Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
          <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
            <Eye className="w-6 h-6 text-primary" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-gray-900">
            OptiScan<span className="text-primary">AI</span>
          </span>
        </Link>

        {user && (
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-sm font-semibold text-gray-800">
                {user.firstName || "User"}
              </span>
              <span className="text-xs text-gray-500">Member</span>
            </div>
            <button
              onClick={() => logout()}
              className="p-2 text-gray-400 hover:text-destructive hover:bg-destructive/10 rounded-full transition-all"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-6 lg:p-8 animate-in fade-in duration-500">
        {children}
      </main>

      {/* Bottom Nav for Mobile */}
      {showNav && user && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 pb-safe z-50">
          <div className="flex justify-between items-center max-w-sm mx-auto">
            {navItems.map((item) => {
              const isActive = location === item.href;
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className={cn(
                    "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
                    isActive 
                      ? "text-primary font-medium" 
                      : "text-gray-400 hover:text-gray-600"
                  )}>
                  <Icon className={cn("w-6 h-6", isActive && "fill-current/20")} />
                  <span className="text-[10px] uppercase tracking-wider">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
