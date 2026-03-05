import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "npm:@supabase/supabase-js@2";

const app = new Hono();

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Storage bucket names
const BUCKET_NAME = 'make-837e6b98-evidence';
const PROJECT_IMAGES_BUCKET = 'make-837e6b98-project-images';

// Create storage buckets on startup
(async () => {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    
    // Create evidence bucket
    const evidenceBucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);
    if (!evidenceBucketExists) {
      await supabase.storage.createBucket(BUCKET_NAME, {
        public: false,
        fileSizeLimit: 52428800, // 50MB
      });
      console.log(`Created storage bucket: ${BUCKET_NAME}`);
    }
    
    // Create project images bucket (PUBLIC for easy access)
    const projectImagesBucketExists = buckets?.some(bucket => bucket.name === PROJECT_IMAGES_BUCKET);
    if (!projectImagesBucketExists) {
      await supabase.storage.createBucket(PROJECT_IMAGES_BUCKET, {
        public: true, // Public bucket zodat URLs niet verlopen
        fileSizeLimit: 10485760, // 10MB
      });
      console.log(`Created storage bucket: ${PROJECT_IMAGES_BUCKET}`);
    } else {
      // Update existing bucket to public if needed
      await supabase.storage.updateBucket(PROJECT_IMAGES_BUCKET, {
        public: true,
        fileSizeLimit: 10485760,
      });
      console.log(`Updated storage bucket to public: ${PROJECT_IMAGES_BUCKET}`);
    }
  } catch (error) {
    console.error('Error initializing storage buckets:', error);
  }
})();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-837e6b98/health", (c) => {
  return c.json({ status: "ok" });
});

// Get all files grouped by kerntaak and onderdeel
app.get("/make-server-837e6b98/files", async (c) => {
  try {
    console.log('Fetching files with prefix: file:');
    const allFiles = await kv.getByPrefix("file:");
    console.log('Files fetched:', allFiles);
    
    return c.json({ files: allFiles || [] });
  } catch (error) {
    console.error('Error fetching files:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: 'Failed to fetch files', details: errorMessage }, 500);
  }
});

// Upload file to onderdeel
app.post("/make-server-837e6b98/upload", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    const kerntaak = formData.get('kerntaak') as string;
    const onderdeel = formData.get('onderdeel') as string;
    const projectTitle = formData.get('projectTitle') as string;
    
    if (!file || !kerntaak || !onderdeel) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    // Generate unique file ID and path
    const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const fileExt = file.name.split('.').pop();
    const filePath = `${kerntaak}/${onderdeel}/${fileId}.${fileExt}`;
    
    // Upload to Supabase Storage
    const fileBuffer = await file.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        upsert: false
      });
    
    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return c.json({ error: 'Failed to upload file to storage' }, 500);
    }
    
    // Store file metadata in KV
    const fileMetadata = {
      id: fileId,
      name: file.name,
      type: file.type,
      size: file.size,
      date: new Date().toISOString(),
      storagePath: filePath,
      kerntaak: Number(kerntaak),
      onderdeel,
      projectTitle: projectTitle || ''
    };
    
    await kv.set(`file:${kerntaak}:${onderdeel}:${fileId}`, fileMetadata);
    
    return c.json({ file: fileMetadata });
  } catch (error) {
    console.error('Error uploading file:', error);
    return c.json({ error: 'Failed to upload file' }, 500);
  }
});

// Get signed URL for file download
app.get("/make-server-837e6b98/files/:fileId/download", async (c) => {
  try {
    const fileId = c.req.param('fileId');
    
    // Find the file by searching all prefixes
    const allFiles = await kv.getByPrefix("file:");
    const fileMetadata = allFiles.find((f: any) => f.id === fileId);
    
    if (!fileMetadata) {
      return c.json({ error: 'File not found' }, 404);
    }
    
    // Generate signed URL (valid for 1 hour)
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(fileMetadata.storagePath, 3600);
    
    if (error) {
      console.error('Error creating signed URL:', error);
      return c.json({ error: 'Failed to generate download URL' }, 500);
    }
    
    return c.json({ url: data.signedUrl, filename: fileMetadata.name });
  } catch (error) {
    console.error('Error getting download URL:', error);
    return c.json({ error: 'Failed to get download URL' }, 500);
  }
});

// Delete file
app.delete("/make-server-837e6b98/files/:fileId", async (c) => {
  try {
    const fileId = c.req.param('fileId');
    
    // Find the file
    const allFiles = await kv.getByPrefix("file:");
    const fileMetadata = allFiles.find((f: any) => f.id === fileId);
    
    if (!fileMetadata) {
      return c.json({ error: 'File not found' }, 404);
    }
    
    // Delete from storage
    const { error: deleteError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([fileMetadata.storagePath]);
    
    if (deleteError) {
      console.error('Storage delete error:', deleteError);
      return c.json({ error: 'Failed to delete file from storage' }, 500);
    }
    
    // Delete metadata from KV
    await kv.del(`file:${fileMetadata.kerntaak}:${fileMetadata.onderdeel}:${fileId}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting file:', error);
    return c.json({ error: 'Failed to delete file' }, 500);
  }
});

// Get all checklist items
app.get("/make-server-837e6b98/checklist", async (c) => {
  try {
    console.log('Fetching checklist items with prefix: checklist:');
    const allChecks = await kv.getByPrefix("checklist:");
    console.log('Checklist items fetched:', allChecks);
    return c.json({ items: allChecks || [] });
  } catch (error) {
    console.error('Error fetching checklist:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: 'Failed to fetch checklist', details: errorMessage }, 500);
  }
});

// Toggle checklist item
app.post("/make-server-837e6b98/checklist/toggle", async (c) => {
  try {
    const body = await c.req.json();
    const { kerntaak, onderdeel } = body;
    
    if (!kerntaak || !onderdeel) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    const key = `checklist:${kerntaak}:${onderdeel}`;
    const existing = await kv.get(key);
    
    const newValue = {
      kerntaak: Number(kerntaak),
      onderdeel,
      completed: existing ? !existing.completed : true,
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(key, newValue);
    
    return c.json({ item: newValue });
  } catch (error) {
    console.error('Error toggling checklist item:', error);
    return c.json({ error: 'Failed to toggle checklist item' }, 500);
  }
});

// Get portfolio stats
app.get("/make-server-837e6b98/stats", async (c) => {
  try {
    console.log('Fetching portfolio stats');
    
    // Get all projects (assuming they're stored with prefix "project:")
    const allProjects = await kv.getByPrefix("project:");
    const projectCount = allProjects?.length || 0;
    
    // Get all evidence files
    const allFiles = await kv.getByPrefix("file:");
    const evidenceCount = allFiles?.length || 0;
    
    // Extract unique technologies from projects
    const technologies = new Set<string>();
    allProjects?.forEach((project: any) => {
      if (project.technologies && Array.isArray(project.technologies)) {
        project.technologies.forEach((tech: string) => technologies.add(tech));
      }
    });
    
    const techCount = technologies.size || 10; // Default to 10 if no projects yet
    
    console.log(`Stats: ${projectCount} projects, ${techCount} technologies, ${evidenceCount} evidence files`);
    
    return c.json({ 
      projects: projectCount,
      technologies: techCount,
      evidence: evidenceCount
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: 'Failed to fetch stats', details: errorMessage }, 500);
  }
});

// Upload project cover image
app.post("/make-server-837e6b98/project-image/upload", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    const projectId = formData.get('projectId') as string;
    
    if (!file || !projectId) {
      return c.json({ error: 'Missing required fields (file, projectId)' }, 400);
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return c.json({ error: 'Only image files are allowed' }, 400);
    }
    
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const timestamp = Date.now();
    const filePath = `project-${projectId}-${timestamp}.${fileExt}`;
    
    // Upload to Supabase Storage
    const fileBuffer = await file.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from(PROJECT_IMAGES_BUCKET)
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        upsert: true // Allow replacing existing images
      });
    
    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return c.json({ error: 'Failed to upload image to storage', details: uploadError.message }, 500);
    }
    
    // Generate public URL (never expires because bucket is public)
    const { data: publicUrlData } = supabase.storage
      .from(PROJECT_IMAGES_BUCKET)
      .getPublicUrl(filePath);
    
    console.log(`Project image uploaded: ${filePath}`);
    console.log(`Public URL: ${publicUrlData.publicUrl}`);
    
    return c.json({ 
      imageUrl: publicUrlData.publicUrl,
      storagePath: filePath
    });
  } catch (error) {
    console.error('Error uploading project image:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: 'Failed to upload project image', details: errorMessage }, 500);
  }
});

// Get public URL for project image
app.get("/make-server-837e6b98/project-image/:projectId", async (c) => {
  try {
    const projectId = c.req.param('projectId');
    
    // List all files for this project
    const { data: files, error: listError } = await supabase.storage
      .from(PROJECT_IMAGES_BUCKET)
      .list('', {
        search: `project-${projectId}`
      });
    
    if (listError || !files || files.length === 0) {
      return c.json({ error: 'No image found for this project' }, 404);
    }
    
    // Get the most recent file
    const sortedFiles = files.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    const latestFile = sortedFiles[0];
    
    // Generate public URL (never expires)
    const { data: publicUrlData } = supabase.storage
      .from(PROJECT_IMAGES_BUCKET)
      .getPublicUrl(latestFile.name);
    
    return c.json({ imageUrl: publicUrlData.publicUrl });
  } catch (error) {
    console.error('Error getting project image:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: 'Failed to get project image', details: errorMessage }, 500);
  }
});

Deno.serve(app.fetch);