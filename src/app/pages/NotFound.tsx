import { Link } from "react-router";
import { Home, SearchX } from "lucide-react";

export function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="text-center max-w-md relative z-10">
        {/* Icon */}
        <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <SearchX className="h-10 w-10 text-primary" />
        </div>

        {/* 404 Number */}
        <h1 className="text-8xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4">404</h1>
        
        <h2 className="mb-4">Pagina niet gevonden</h2>
        <p className="text-muted-foreground mb-8">
          De pagina die je zoekt bestaat niet of is verplaatst.
        </p>
        
        <Link to="/">
          <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-all hover:scale-105 shadow-lg shadow-primary/20 flex items-center gap-2 mx-auto">
            <Home className="h-4 w-4" />
            Terug naar home
          </button>
        </Link>
      </div>
    </div>
  );
}