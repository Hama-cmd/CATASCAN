import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Eye, History, LogOut, Home, User, Info, Sun, Moon } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

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
    { href: "/info", icon: Info, label: "Education" },
  ];

  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background flex flex-col font-sans transition-colors duration-300">
      {/* Mobile-first Header */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-card/90 backdrop-blur-md border-b border-gray-100 dark:border-border shadow-sm px-4 py-3 flex items-center justify-between transition-colors duration-300">
        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
          <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-xl group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors">
            <Eye className="w-6 h-6 text-primary" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-gray-900 dark:text-foreground">
            CataScan<span className="text-primary"></span>
          </span>
        </Link>

        {user ? (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {user.firstName || "User"}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Member</span>
            </div>
            <button
              onClick={() => logout()}
              className="p-2 text-gray-400 dark:text-gray-500 hover:text-destructive dark:hover:text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/10 rounded-full transition-all"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-6 lg:p-8 animate-in fade-in duration-500">
        {children}
      </main>

      {/* Bottom Nav for Mobile */}
      {showNav && user && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-card border-t border-gray-200 dark:border-border px-6 py-3 pb-safe z-50 transition-colors duration-300">
          <div className="flex justify-between items-center max-w-sm mx-auto">
            {navItems.map((item) => {
              const isActive = location === item.href;
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
                  isActive
                    ? "text-primary font-medium"
                    : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
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
