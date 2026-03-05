# Project Cover Foto Upload - Instructies

## Hoe werkt het?

Je portfolio heeft nu een volledig werkend systeem voor het uploaden en beheren van project cover foto's.

## Uploaden via de Website (Aanbevolen)

### Stap 1: Navigeer naar Projecten pagina
- Ga naar de "Projecten" pagina in je portfolio
- Je ziet al je projecten met een placeholder afbeelding

### Stap 2: Upload een Cover Foto
- Klik op de **"Upload foto"** knop rechtsonder op de project afbeelding
- Selecteer een afbeelding van je computer (max 10MB)
- De afbeelding wordt automatisch geüpload naar Supabase Storage

### Stap 3: Kopieer de URL
- Na een succesvolle upload wordt de **image URL automatisch gekopieerd** naar je clipboard
- Je ziet een melding: "Image URL gekopieerd naar clipboard!"

### Stap 4: Voeg URL toe aan je Project
- Open `/src/app/data/projects.ts`
- Plak de URL in het `imageUrl` veld van je project:

```typescript
{
  id: 1,
  title: "City Deal Kennismaken",
  // ... andere velden
  imageUrl: "https://....signed URL...",
}
```

## Alternatieve Methoden

### Optie 2: Externe Afbeelding URL
Je kunt ook een afbeelding van een externe bron gebruiken:
- Upload je afbeelding naar een image hosting service (Imgur, Cloudinary, etc.)
- Kopieer de directe image URL
- Voeg deze toe aan het `imageUrl` veld

### Optie 3: Unsplash Afbeelding
Vraag mij om een relevante afbeelding te zoeken:
- "Zoek een afbeelding voor een dashboard applicatie"
- Ik gebruik Unsplash om een passende afbeelding te vinden
- Ik voeg de URL automatisch toe aan je project

## Technische Details

### Backend
- **Bucket**: `make-837e6b98-project-images` (automatisch aangemaakt)
- **Max bestandsgrootte**: 10MB
- **Toegestane types**: Alleen afbeeldingen (image/*)
- **URL geldigheid**: Signed URLs geldig voor 1 jaar

### Endpoints
- Upload: `POST /make-server-837e6b98/project-image/upload`
- Ophalen: `GET /make-server-837e6b98/project-image/:projectId`

### Opslag Structuur
```
make-837e6b98-project-images/
├── project-1-1234567890.jpg
├── project-1-1234567891.jpg  (nieuwere versie)
└── project-2-1234567892.png
```

## Tips

✅ **Aanbevolen afbeelding formaten**: JPG, PNG, WebP
✅ **Aanbevolen afmeting**: 640x360px of hoger (16:9 ratio)
✅ **Bestandsgrootte**: Houd het onder 2MB voor snelle laadtijden

## Geen Afbeelding?

Als je geen `imageUrl` opgeeft, wordt automatisch een mooie gradient placeholder getoond.

## Voorbeeld

```typescript
export const projects: Project[] = [
  {
    id: 1,
    title: "City Deal Kennismaken",
    description: "Vraag & Aanbod Webapp",
    longDescription: "Voor City Deal Kennis Maken Limburg...",
    date: "2026-03-05",
    technologies: ["React", "TypeScript", "Tailwind CSS"],
    category: "Web Development",
    imageUrl: "https://xxxxx.supabase.co/storage/v1/object/sign/...",
    demoUrl: "https://example.com",
    githubUrl: "https://github.com/...",
  },
];
```
