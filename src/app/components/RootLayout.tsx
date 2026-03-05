import { Outlet, Link, useLocation } from "react-router";
import { Briefcase, FolderOpen, FileCheck, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export function RootLayout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Set favicon dynamically
  useEffect(() => {
    const favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement || document.createElement('link');
    favicon.rel = 'icon';
    favicon.type = 'image/svg+xml';
    favicon.href = `data:image/svg+xml,${encodeURIComponent(`
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="64" height="64" rx="12" fill="#0a0a0a"/>
        <rect width="64" height="64" rx="12" fill="url(#gradient)" opacity="0.1"/>
        <rect x="1" y="1" width="62" height="62" rx="11" stroke="#3b82f6" stroke-width="2" opacity="0.3"/>
        <text x="32" y="43" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="700" fill="#3b82f6" text-anchor="middle">DH</text>
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop stop-color="#3b82f6"/>
            <stop offset="1" stop-color="#3b82f6" stop-opacity="0"/>
          </linearGradient>
        </defs>
      </svg>
    `)}`;
    if (!document.head.contains(favicon)) {
      document.head.appendChild(favicon);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Enhanced Header with backdrop blur and gradient border */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-xl sticky top-0 z-50 shadow-lg">
        {/* Gradient accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
        
        <div className="max-w-6xl mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <Link 
              to="/" 
              className="group flex items-center gap-2 text-xl font-semibold text-foreground hover:text-primary transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Briefcase className="h-4 w-4 text-primary" />
              </div>
              Danny Habel
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-2">
              <Link
                to="/"
                className={`relative px-4 py-2 text-sm rounded-lg transition-all hover:scale-105 ${
                  location.pathname === "/"
                    ? "text-primary font-medium bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {location.pathname === "/" && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
                )}
                Home
              </Link>
              <Link
                to="/projecten"
                className={`relative px-4 py-2 text-sm rounded-lg transition-all hover:scale-105 flex items-center gap-2 ${
                  location.pathname === "/projecten"
                    ? "text-primary font-medium bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {location.pathname === "/projecten" && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
                )}
                <FolderOpen className="h-4 w-4" />
                Projecten
              </Link>
              <Link
                to="/bewijslast"
                className={`relative px-4 py-2 text-sm rounded-lg transition-all hover:scale-105 flex items-center gap-2 ${
                  location.pathname === "/bewijslast"
                    ? "text-primary font-medium bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {location.pathname === "/bewijslast" && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
                )}
                <FileCheck className="h-4 w-4" />
                Bewijslast
              </Link>
            </div>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-foreground hover:text-primary hover:bg-secondary rounded-lg transition-all"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </nav>
          
          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 text-sm rounded-lg transition-all ${
                  location.pathname === "/"
                    ? "text-primary font-medium bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                Home
              </Link>
              <Link
                to="/projecten"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 text-sm rounded-lg transition-all flex items-center gap-2 ${
                  location.pathname === "/projecten"
                    ? "text-primary font-medium bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <FolderOpen className="h-4 w-4" />
                Projecten
              </Link>
              <Link
                to="/bewijslast"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 text-sm rounded-lg transition-all flex items-center gap-2 ${
                  location.pathname === "/bewijslast"
                    ? "text-primary font-medium bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <FileCheck className="h-4 w-4" />
                Bewijslast
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Enhanced Footer */}
      <footer className="border-t border-border/50 bg-gradient-to-b from-card to-card/50 mt-20">
        {/* Gradient accent line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
        
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex justify-center items-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Danny Habel. Alle rechten voorbehouden.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}