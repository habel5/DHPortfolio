import { Link } from "react-router";
import { 
  ArrowRight, 
  FolderOpen, 
  FileCheck, 
  Code2, 
  Database, 
  Palette, 
  Zap,
  CheckCircle,
  Sparkles
} from "lucide-react";
import { useEffect, useState } from "react";
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { projects } from '../data/projects';

export function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [stats, setStats] = useState({
    projects: projects.length,
    evidence: 0,
    completedTasks: 0,
    totalTasks: 8 // Kerntaak 1 (5 onderdelen) + Kerntaak 2 (3 onderdelen)
  });

  useEffect(() => {
    setIsVisible(true);
    
    // Fetch evidence and checklist data from the server
    const fetchStats = async () => {
      try {
        // Fetch evidence files
        const filesResponse = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-837e6b98/files`,
          {
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`
            }
          }
        );
        
        // Fetch checklist items
        const checklistResponse = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-837e6b98/checklist`,
          {
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`
            }
          }
        );
        
        const filesData = filesResponse.ok ? await filesResponse.json() : { files: [] };
        const checklistData = checklistResponse.ok ? await checklistResponse.json() : { items: [] };
        
        // Count completed checklist items
        const completedCount = checklistData.items?.filter((item: any) => item.completed).length || 0;
        
        setStats({
          projects: projects.length,
          evidence: filesData.files?.length || 0,
          completedTasks: completedCount,
          totalTasks: 8
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Keep default values on error
        setStats({
          projects: projects.length,
          evidence: 0,
          completedTasks: 0,
          totalTasks: 8
        });
      }
    };
    
    fetchStats();
  }, []);
  
  return (
    <div className="bg-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-24 relative">
        <div className={`max-w-3xl transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary font-medium">Portfolioexamen 2026</span>
          </div>

          <h1 className="mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Welkom op mijn portfolio
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed">
            Software Developer in opleiding met passie voor <span className="text-primary font-medium">full-stack development</span>. 
            Hier vind je mijn projecten en bewijslast voor mijn portfolioexamen.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link to="/projecten">
              <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/20 flex items-center gap-2">
                Bekijk projecten
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
            <Link to="/bewijslast">
              <button className="border border-border px-6 py-3 rounded-lg hover:bg-secondary transition-all hover:scale-105">
                Bewijslast
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Decorative Gradient Divider */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 relative">
        <div className="relative h-auto sm:h-32 rounded-2xl overflow-hidden p-4 sm:p-0">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10 animate-pulse-slow"></div>
          
          {/* Overlay pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
            <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
          </div>
          
          {/* Subtle grid pattern */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}></div>
          
          {/* Top gradient border */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
          
          {/* Bottom gradient border */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
          
          {/* Stats Content */}
          <div className="relative h-full flex items-center justify-center py-8 sm:py-0">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-12 text-center w-full">
              <StatItem number={stats.projects} label="Projecten" />
              <StatItem number={stats.evidence} label="Bewijsstukken" />
              <StatItem 
                number={stats.completedTasks} 
                label={`Onderdelen (${stats.completedTasks}/${stats.totalTasks})`}
                suffix=""
              />
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 relative">
        <div className="text-center mb-12">
          <h2 className="mb-3">Wat ik kan</h2>
          <p className="text-muted-foreground">Vaardigheden die ik heb ontwikkeld tijdens mijn opleiding</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <SkillCard 
            icon={Code2} 
            title="Frontend" 
            description="React, TypeScript, Tailwind CSS"
            delay={0}
          />
          <SkillCard 
            icon={Database} 
            title="Backend" 
            description="Node.js, Supabase, API's"
            delay={100}
          />
          <SkillCard 
            icon={Palette} 
            title="UI/UX" 
            description="Responsive Design, Prototyping"
            delay={200}
          />
          <SkillCard 
            icon={Zap} 
            title="Tools" 
            description="Git, VS Code, Figma"
            delay={300}
          />
        </div>
      </section>

      {/* Quick Links */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/projecten" className="group">
            <div className="relative border border-border rounded-lg p-8 hover:shadow-xl transition-all bg-card overflow-hidden hover:border-primary/50">
              {/* Gradient accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FolderOpen className="h-7 w-7 text-primary" />
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
            <div className="relative border border-border rounded-lg p-8 hover:shadow-xl transition-all bg-card overflow-hidden hover:border-primary/50">
              {/* Gradient accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileCheck className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mb-2">Bewijslast</h3>
              <p className="text-muted-foreground mb-4">
                Documentatie en bewijsmateriaal voor mijn portfolioexamen, georganiseerd per kerntaak.
              </p>
              <span className="text-primary text-sm font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                Bekijk bewijslast
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Key Highlights */}
      <section className="max-w-6xl mx-auto px-6 py-12 pb-20 relative">
        <div className="bg-card border border-border rounded-xl p-8">
          <h3 className="mb-6 text-center">Kerntaken Portfolio</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-primary" />
                </div>
              </div>
              <div>
                <h4 className="text-base mb-1">Kerntaak 1: Software Ontwikkelen</h4>
                <p className="text-sm text-muted-foreground">Plant werkzaamheden, ontwerpt, realiseert en test software met verbetervoorstellen.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-primary" />
                </div>
              </div>
              <div>
                <h4 className="text-base mb-1">Kerntaak 2: Professionele Vaardigheden</h4>
                <p className="text-sm text-muted-foreground">Voert overleg, presenteert resultaten en reflecteert op het werk en leerproces.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function SkillCard({ 
  icon: Icon, 
  title, 
  description, 
  delay 
}: { 
  icon: any; 
  title: string; 
  description: string; 
  delay: number;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={`bg-card border border-border rounded-lg p-6 text-center hover:border-primary/50 hover:shadow-lg transition-all cursor-default ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ transitionDuration: '500ms' }}
    >
      <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl flex items-center justify-center mx-auto mb-3">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h4 className="text-base mb-2">{title}</h4>
      <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

function StatItem({ number, label, suffix = '+' }: { number: number; label: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const targetNumber = number;

  useEffect(() => {
    if (hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasAnimated(true);
          let current = 0;
          const increment = targetNumber / 30;
          const timer = setInterval(() => {
            current += increment;
            if (current >= targetNumber) {
              setCount(targetNumber);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, 40);
        }
      },
      { threshold: 0.5 }
    );

    const element = document.getElementById(`stat-${label}`);
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [targetNumber, label, hasAnimated]);

  return (
    <div id={`stat-${label}`}>
      <div className="text-4xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
        {count}{number > 9 ? suffix : ''}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}