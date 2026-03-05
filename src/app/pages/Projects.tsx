import { useState, useEffect, useRef } from "react";
import { Badge } from "../components/ui/badge";
import { ExternalLink, Github, Calendar, Tag, Sparkles, Upload, Loader2, Copy, X } from "lucide-react";
import { projects, type Project } from "../data/projects";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useToast, ToastContainer } from "../components/Toast";
import { projectId, publicAnonKey } from '/utils/supabase/info';

const categories = Array.from(new Set(projects.map(p => p.category)));

export function Projects() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Alle");
  const [isVisible, setIsVisible] = useState(false);
  const [uploadingProjectId, setUploadingProjectId] = useState<number | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const { toasts, showToast, closeToast } = useToast();
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const filteredProjects = selectedCategory === "Alle" 
    ? projects 
    : projects.filter(p => p.category === selectedCategory);

  const handleImageUpload = async (projectIdToUpload: number, file: File) => {
    setUploadingProjectId(projectIdToUpload);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('projectId', projectIdToUpload.toString());
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-837e6b98/project-image/upload`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: formData
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload mislukt');
      }
      
      const data = await response.json();
      
      // Toon de URL in een modal voor eenvoudig kopiëren
      setUploadedImageUrl(data.imageUrl);
      console.log('📸 IMAGE URL (kopieer deze naar je project):', data.imageUrl);
      showToast('Cover foto succesvol geüpload!', 'success');
    } catch (error) {
      console.error('Error uploading image:', error);
      showToast(error instanceof Error ? error.message : 'Fout bij uploaden van afbeelding', 'error');
    } finally {
      setUploadingProjectId(null);
    }
  };

  const triggerFileInput = (projectIdToUpload: number) => {
    fileInputRefs.current[projectIdToUpload]?.click();
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast('URL gekopieerd naar clipboard!', 'success');
    } catch (error) {
      // Fallback: selecteer de tekst zodat de gebruiker handmatig kan kopiëren
      showToast('Selecteer en kopieer de URL handmatig (Ctrl+C)', 'error');
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <ToastContainer toasts={toasts} onClose={closeToast} />
      
      {/* Image URL Modal */}
      {/* {uploadedImageUrl && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl max-w-2xl w-full p-6 shadow-2xl">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">Cover Foto Geüpload!</h3>
                <p className="text-sm text-muted-foreground">
                  Kopieer de URL hieronder en voeg toe aan je project in <code className="text-xs bg-muted px-1 py-0.5 rounded">/src/app/data/projects.ts</code>
                </p>
              </div>
              <button
                onClick={() => setUploadedImageUrl(null)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <code className="text-xs flex-1 break-all select-all">{uploadedImageUrl}</code>
                <button
                  onClick={() => copyToClipboard(uploadedImageUrl)}
                  className="flex-shrink-0 p-2 hover:bg-muted rounded transition-colors"
                  title="Kopieer naar clipboard"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">
                💡 <strong>Tip:</strong> Voeg <code className="bg-muted px-1 py-0.5 rounded">imageUrl: "..."</code> toe aan je project object.
              </p>
            </div>
            
            <button
              onClick={() => setUploadedImageUrl(null)}
              className="w-full mt-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Sluiten
            </button>
          </div>
        </div>
      )} */}
      {/* Hero Section with enhanced visuals */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20 relative">
        <div className="relative">
          {/* Decorative background elements */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl opacity-60"></div>
          
          <div className={`relative transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary font-medium">Portfolio Showcase</span>
          </div>
          
          <h1 className="mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Projecten</h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">
            Een overzicht van mijn projecten. Elk project bevat een beschrijving, gebruikte
            technologieën en links naar demo's en broncode.
          </p>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-12 relative">
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <button
            onClick={() => setSelectedCategory("Alle")}
            className={`px-4 py-2 rounded-lg text-sm transition-all hover:scale-105 ${
              selectedCategory === "Alle"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "bg-card border border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Alle
            </div>
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm transition-all hover:scale-105 ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "bg-card border border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Projects Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 relative">
        <div className="grid gap-6">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className={`group relative border border-border rounded-xl p-6 bg-gradient-to-br from-card to-card/50 hover:shadow-xl transition-all duration-500 hover:border-primary/50 overflow-hidden ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Gradient accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Project Image */}
                <div className="relative lg:w-80 h-48 flex-shrink-0">
                  {project.imageUrl ? (
                    <div className="w-full h-full rounded-lg overflow-hidden group-hover:scale-[1.02] transition-transform">
                      <ImageWithFallback 
                        src={project.imageUrl} 
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary rounded-lg flex items-center justify-center group-hover:scale-[1.02] transition-transform">
                      <span className="text-muted-foreground">Project afbeelding</span>
                    </div>
                  )}
                  
                  {/* Upload button overlay */}
                  {/* <button
                    onClick={() => triggerFileInput(project.id)}
                    disabled={uploadingProjectId === project.id || uploadedImageUrl !== null}
                    className="absolute bottom-2 right-2 bg-primary text-primary-foreground px-3 py-2 rounded-lg text-xs flex items-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    {uploadingProjectId === project.id ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Uploaden...
                      </>
                    ) : (
                      <>
                        <Upload className="h-3 w-3" />
                        Upload foto
                      </>
                    )}
                  </button> */}
                  
                  {/* Hidden file input */}
                  {/* <input
                    ref={(el) => fileInputRefs.current[project.id] = el}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleImageUpload(project.id, file);
                      }
                      e.target.value = ''; // Reset input
                    }}
                  /> */}
                </div>

                {/* Project Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="group-hover:text-primary transition-colors">{project.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {new Date(project.date).toLocaleDateString('nl-NL', {
                        year: 'numeric',
                        month: 'long'
                      })}
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4">
                    {project.longDescription}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="hover:bg-primary/10 hover:text-primary transition-colors">
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        className="inline-flex items-center gap-2 text-sm text-primary hover:underline hover:gap-3 transition-all"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Live demo
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        className="inline-flex items-center gap-2 text-sm text-primary hover:underline hover:gap-3 transition-all"
                      >
                        <Github className="h-4 w-4" />
                        Bekijk code
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12 bg-card border border-border rounded-xl">
            <p className="text-muted-foreground">
              Geen projecten gevonden in deze categorie.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}