
export interface ProductImage {
  src: string;
  alt: string;
  title: string;
  description: string;
}
export interface BlueprintPage {
  src: string;
  title: string;
  description?: string;
}

export interface ProductBlueprint {
  available: boolean;
  coverImage: string;
  description: string;
  pages: BlueprintPage[];
}

export interface ProductRoadmap {
  phase: string;
  title: string;
  status: RoadmapStatus;
}

export interface ProductMetrics {
  performance: number;
  seo: number;
  accessibility: number;
}


export type ProductStatus =
  | "Completed"
  | "Active Development"
  | "Maintenance";

export type RoadmapStatus =
  | "completed"
  | "current"
  | "planned";



export interface Product {
  slug: string;

  title: string;

  category: string;

  status: ProductStatus;

  client: string;

  industry: string;

  role: string;

  duration: string;

  year: string;

  featured: boolean;

  blueprint?: ProductBlueprint;

  summary: string;

  description: string;

  technologies: string[];

  coverImage: string;

  gallery: ProductImage[];

  liveUrl?: string;

  githubUrl?: string;

  roadmap?: ProductRoadmap[];

  metrics: ProductMetrics;
}

