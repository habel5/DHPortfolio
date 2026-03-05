import { useState, useEffect, useRef } from "react";
import { Badge } from "../components/ui/badge";
import { 
  FileText, 
  Download, 
  FolderOpen,
  Upload,
  Trash2,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Circle,
  Sparkles
} from "lucide-react";
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { useToast, ToastContainer } from '../components/Toast';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-837e6b98`;

interface FileData {
  id: string;
  name: string;
  type: string;
  size: number;
  date: string;
  storagePath: string;
  kerntaak: number;
  onderdeel: string;
  projectTitle: string;
}

interface ChecklistItem {
  kerntaak: number;
  onderdeel: string;
  completed: boolean;
  updatedAt: string;
}

interface Kerntaak {
  id: number;
  title: string;
  onderdelen: string[];
  description: string;
}

const kerntaken: Kerntaak[] = [
  {
    id: 1,
    title: "Kerntaak 1",
    description: "Software ontwikkelen",
    onderdelen: [
      "Plant werkzaamheden",
      "Ontwerpt Software",
      "Realiseert Software",
      "Testen",
      "Verbetervoorstellen"
    ]
  },
  {
    id: 2,
    title: "Kerntaak 2",
    description: "Communicatie en professionele vaardigheden",
    onderdelen: [
      "Voert Overleg",
      "Presenteren",
      "Reflecteren"
    ]
  }
];

export function Evidence() {
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingOnderdeel, setUploadingOnderdeel] = useState<string | null>(null);
  const [expandedOnderdelen, setExpandedOnderdelen] = useState<Set<string>>(new Set());
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const { toasts, showToast, closeToast } = useToast();

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const url = `${API_URL}/files`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error('Failed to fetch files');
      }
      
      const data = await response.json();
      setFiles(data.files || []);
    } catch (error) {
      console.error('Error fetching files:', error);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchChecklist = async () => {
    try {
      const response = await fetch(`${API_URL}/checklist`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Checklist fetch error:', errorData);
        throw new Error('Failed to fetch checklist');
      }
      
      const data = await response.json();
      console.log('Checklist data received:', data);
      setChecklistItems(data.items || []);
    } catch (error) {
      console.error('Error fetching checklist:', error);
      // Set empty array on error so the app continues to work
      setChecklistItems([]);
    }
  };

  useEffect(() => {
    fetchFiles();
    fetchChecklist();
    setIsVisible(true);
  }, []);

  const handleFileUpload = async (kerntaak: number, onderdeel: string, file: File, projectTitle: string) => {
    const key = `${kerntaak}-${onderdeel}`;
    setUploadingOnderdeel(key);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('kerntaak', kerntaak.toString());
      formData.append('onderdeel', onderdeel);
      formData.append('projectTitle', projectTitle);
      
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      await fetchFiles();
      showToast('✅ Bestand succesvol geüpload', 'success');
    } catch (error) {
      console.error('Error uploading file:', error);
      showToast('❌ Fout bij het uploaden van bestand', 'error');
    } finally {
      setUploadingOnderdeel(null);
    }
  };

  const handleFileDownload = async (fileId: string) => {
    try {
      const response = await fetch(`${API_URL}/files/${fileId}/download`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Download failed');
      }
      
      const data = await response.json();
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error downloading file:', error);
      showToast('❌ Fout bij het downloaden van bestand', 'error');
    }
  };

  const handleFileDelete = async (fileId: string) => {
    if (!confirm('Weet je zeker dat je dit bestand wilt verwijderen?')) {
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Delete failed');
      }
      
      await fetchFiles();
      showToast('✅ Bestand succesvol verwijderd', 'success');
    } catch (error) {
      console.error('Error deleting file:', error);
      showToast('❌ Fout bij het verwijderen van bestand', 'error');
    }
  };

  const toggleOnderdeel = (key: string) => {
    setExpandedOnderdelen(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const handleChecklistToggle = async (kerntaak: number, onderdeel: string) => {
    try {
      const response = await fetch(`${API_URL}/checklist/toggle`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ kerntaak, onderdeel })
      });
      
      if (!response.ok) {
        throw new Error('Failed to toggle checklist');
      }
      
      await fetchChecklist();
    } catch (error) {
      console.error('Error toggling checklist:', error);
      showToast('❌ Fout bij het wijzigen van checklist', 'error');
    }
  };

  const isChecked = (kerntaak: number, onderdeel: string) => {
    return checklistItems.find(
      item => item.kerntaak === kerntaak && item.onderdeel === onderdeel
    )?.completed || false;
  };

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Laden...</p>
        </div>
      </div>
    );
  }

  const totalFiles = files.length;
  const kerntaak1Files = files.filter(f => f.kerntaak === 1).length;
  const kerntaak2Files = files.filter(f => f.kerntaak === 2).length;

  // Calculate checklist progress
  const totalOnderdelen = kerntaken.reduce((sum, kt) => sum + kt.onderdelen.length, 0);
  const completedOnderdelen = checklistItems.filter(item => item.completed).length;
  const progressPercentage = totalOnderdelen > 0 
    ? Math.round((completedOnderdelen / totalOnderdelen) * 100) 
    : 0;

  return (
    <div className="bg-background min-h-screen relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 relative">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary font-medium">Bewijsmateriaal</span>
          </div>
          
          <h1 className="mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Portfolioexamen Bewijslast</h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">
            Hier upload ik mijn bewijslast voor de nodige onderdelen van het Portfolioexamen.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-8 relative">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-gradient-to-br from-card to-card/50 border border-border rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all hover:border-primary/50">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <span className="text-xs sm:text-sm text-muted-foreground">Voortgang</span>
            </div>
            <div className="text-2xl sm:text-3xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">{progressPercentage}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {completedOnderdelen} van {totalOnderdelen} onderdelen
            </p>
          </div>

          <div className="bg-gradient-to-br from-card to-card/50 border border-border rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all hover:border-primary/50">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <FolderOpen className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <span className="text-xs sm:text-sm text-muted-foreground">Totaal</span>
            </div>
            <div className="text-2xl sm:text-3xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">{totalFiles}</div>
          </div>

          <div className="bg-gradient-to-br from-card to-card/50 border border-border rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all hover:border-primary/50">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <span className="text-xs sm:text-sm text-muted-foreground">Kerntaak 1</span>
            </div>
            <div className="text-2xl sm:text-3xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">{kerntaak1Files}</div>
          </div>

          <div className="bg-gradient-to-br from-card to-card/50 border border-border rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all hover:border-primary/50">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <span className="text-xs sm:text-sm text-muted-foreground">Kerntaak 2</span>
            </div>
            <div className="text-2xl sm:text-3xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">{kerntaak2Files}</div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 relative">
        <div className="space-y-8">
          {kerntaken.map((kerntaak) => (
            <div key={kerntaak.id} className="space-y-4">
              <div className="bg-gradient-to-br from-card to-card/50 border border-border rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all hover:border-primary/50">
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <h3 className="text-lg sm:text-xl">{kerntaak.title}</h3>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    {files.filter(f => f.kerntaak === kerntaak.id).length} bestanden
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{kerntaak.description}</p>
              </div>

              <div className="space-y-3">
                {kerntaak.onderdelen.map((onderdeel) => {
                  const onderdeelFiles = files.filter(f => f.kerntaak === kerntaak.id && f.onderdeel === onderdeel);
                  const key = `${kerntaak.id}-${onderdeel}`;
                  const isExpanded = expandedOnderdelen.has(key);
                  const isUploading = uploadingOnderdeel === key;

                  return (
                    <OnderdeelCard
                      key={key}
                      kerntaak={kerntaak.id}
                      onderdeel={onderdeel}
                      files={onderdeelFiles}
                      isExpanded={isExpanded}
                      isUploading={isUploading}
                      onToggle={() => toggleOnderdeel(key)}
                      onUpload={handleFileUpload}
                      onDownload={handleFileDownload}
                      onDelete={handleFileDelete}
                      onChecklistToggle={handleChecklistToggle}
                      isChecked={isChecked}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
      <ToastContainer toasts={toasts} onClose={closeToast} />
    </div>
  );
}

function OnderdeelCard({
  kerntaak,
  onderdeel,
  files,
  isExpanded,
  isUploading,
  onToggle,
  onUpload,
  onDownload,
  onDelete,
  onChecklistToggle,
  isChecked
}: {
  kerntaak: number;
  onderdeel: string;
  files: FileData[];
  isExpanded: boolean;
  isUploading: boolean;
  onToggle: () => void;
  onUpload: (kerntaak: number, onderdeel: string, file: File, projectTitle: string) => void;
  onDownload: (fileId: string) => void;
  onDelete: (fileId: string) => void;
  onChecklistToggle: (kerntaak: number, onderdeel: string) => void;
  isChecked: (kerntaak: number, onderdeel: string) => boolean;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [projectTitle, setProjectTitle] = useState("");
  const [showProjectInput, setShowProjectInput] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPendingFile(file);
      setShowProjectInput(true);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadWithTitle = () => {
    if (pendingFile) {
      onUpload(kerntaak, onderdeel, pendingFile, projectTitle);
      setPendingFile(null);
      setProjectTitle("");
      setShowProjectInput(false);
    }
  };

  const handleCancelUpload = () => {
    setPendingFile(null);
    setProjectTitle("");
    setShowProjectInput(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileTypeLabel = (type: string) => {
    if (type.includes('pdf')) return 'PDF';
    if (type.includes('video')) return 'Video';
    if (type.includes('image')) return 'Afbeelding';
    if (type.includes('word') || type.includes('document')) return 'Document';
    return 'Bestand';
  };

  const checked = isChecked(kerntaak, onderdeel);

  return (
    <div className="border border-border rounded-xl bg-gradient-to-br from-card to-card/50 overflow-hidden hover:shadow-lg transition-all hover:border-primary/50">
      <div className="flex items-center gap-3 p-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onChecklistToggle(kerntaak, onderdeel);
          }}
          className="flex-shrink-0 hover:opacity-80 transition-opacity hover:scale-110"
          title={checked ? "Markeer als niet voltooid" : "Markeer als voltooid"}
        >
          {checked ? (
            <CheckCircle2 className="h-5 w-5 text-primary" />
          ) : (
            <Circle className="h-5 w-5 text-muted-foreground" />
          )}
        </button>
        
        <button
          onClick={onToggle}
          className="flex-1 flex items-center justify-between hover:opacity-80 transition-opacity"
        >
          <div className="flex items-center gap-3">
            <h4 className="text-base">{onderdeel}</h4>
            <Badge variant="outline" className="text-xs">
              {files.length} {files.length === 1 ? 'bestand' : 'bestanden'}
            </Badge>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="border-t border-border p-4 space-y-3 bg-background/50">
          <div>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              accept=".pdf,.doc,.docx,.mp4,.mov,.avi,.png,.jpg,.jpeg"
              disabled={isUploading}
            />
            
            {showProjectInput ? (
              <div className="space-y-3 p-4 bg-secondary/50 rounded-lg border border-border">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Project Titel (optioneel)
                  </label>
                  <input
                    type="text"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="bijv. E-commerce Platform"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Bestand: {pendingFile?.name}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleUploadWithTitle}
                    disabled={isUploading}
                    className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all hover:scale-105 disabled:opacity-50 shadow-lg shadow-primary/20"
                  >
                    {isUploading ? 'Uploaden...' : 'Uploaden'}
                  </button>
                  <button
                    onClick={handleCancelUpload}
                    disabled={isUploading}
                    className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-all hover:scale-105"
                  >
                    Annuleren
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    <span className="text-sm">Uploaden...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 text-primary" />
                    <span className="text-sm text-primary">Bestand Uploaden</span>
                  </>
                )}
              </button>
            )}
          </div>

          {files.length > 0 ? (
            <div className="space-y-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg hover:bg-secondary/80 transition-all hover:scale-[1.01] border border-border"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm block truncate">{file.name}</span>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                        <span>{new Date(file.date).toLocaleDateString('nl-NL')}</span>
                        <span>•</span>
                        <span>{formatFileSize(file.size)}</span>
                        {file.projectTitle && (
                          <>
                            <span>•</span>
                            <span className="font-medium">{file.projectTitle}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs flex-shrink-0">
                      {getFileTypeLabel(file.type)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <button
                      onClick={() => onDownload(file.id)}
                      className="text-primary hover:text-primary/80 p-2 hover:scale-110 transition-transform"
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(file.id)}
                      className="text-destructive hover:text-destructive/80 p-2 hover:scale-110 transition-transform"
                      title="Verwijderen"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nog geen bestanden geüpload voor dit onderdeel
            </p>
          )}
        </div>
      )}
    </div>
  );
}