export interface Project {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  date: string;
  technologies: string[];
  category: string;
  imageUrl?: string;
  demoUrl?: string;
  githubUrl?: string;
}

export const projects: Project[] = [
  {
    id: 1,
    title: "City Deal Kennismaken",
    description: "Vraag & Aanbod Webapp",
    longDescription:
      "Voor City Deal Kennis Maken Limburg heb ik meegewerkt aan de ontwikkeling van een webplatform waar gemeentes in Limburg hun maatschappelijke uitdagingen kunnen plaatsen. De webapplicatie biedt een centrale plek om vraagstukken aan te maken, beheren en terug te vinden. Daarnaast heeft een docent (admin) toegang tot een beheerdersomgeving om de inhoud te controleren en toezicht te houden op het proces. Het platform stimuleert samenwerking tussen gemeentes en het onderwijs.",
    date: "2026-03-05",
    technologies: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Deno",
      "Hono",
      "PostgreSQL",
      "Supabase",
    ],
    category: "Web Development",
    imageUrl:
      "https://goybdnjtsylfmojjibob.supabase.co/storage/v1/object/public/make-837e6b98-project-images/project-1-1772711843412.png",
    demoUrl: "https://example.com",
    githubUrl: "https://github.com/...",
  },
];