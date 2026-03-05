import { Link } from "react-router";
import { ArrowRight, FolderOpen, FileCheck } from "lucide-react";

export function Home() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="max-w-3xl">
          <h1 className="mb-6">
            Welkom op mijn portfolio
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Hier vind je een overzicht van mijn projecten en bewijslast voor mijn
            portfolioexamen. Bekijk mijn werk en documentatie.
          </p>
          <div className="flex gap-4">
            <Link to="/projecten">
              <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2">
                Bekijk projecten
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
            <Link to="/bewijslast">
              <button className="border border-border px-6 py-3 rounded-lg hover:bg-secondary transition-colors">
                Bewijslast
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-6">
          <Link to="/projecten" className="group">
            <div className="border border-border rounded-lg p-8 hover:shadow-lg transition-all bg-card">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <FolderOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2">Projecten</h3>
              <p className="text-muted-foreground mb-4">
                Bekijk mijn voltooide projecten met beschrijvingen, technologieën en resultaten.
              </p>
              <span className="text-primary text-sm font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                Bekijk alle projecten
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>

          <Link to="/bewijslast" className="group">
            <div className="border border-border rounded-lg p-8 hover:shadow-lg transition-all bg-card">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <FileCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2">Bewijslast</h3>
              <p className="text-muted-foreground mb-4">
                Documentatie en bewijsmateriaal voor mijn portfolioexamen, georganiseerd per project.
              </p>
              <span className="text-primary text-sm font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                Bekijk bewijslast
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="bg-card border border-border rounded-lg p-8">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-semibold text-primary mb-2">5+</div>
              <div className="text-sm text-muted-foreground">Projecten</div>
            </div>
            <div>
              <div className="text-4xl font-semibold text-primary mb-2">10+</div>
              <div className="text-sm text-muted-foreground">Technologieën</div>
            </div>
            <div>
              <div className="text-4xl font-semibold text-primary mb-2">15+</div>
              <div className="text-sm text-muted-foreground">Bewijsstukken</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
