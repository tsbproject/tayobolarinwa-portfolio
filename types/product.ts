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

export type ProductStatus =
  | "Completed"
  | "Active Development"
  | "Maintenance";

export type RoadmapStatus =
  | "completed"
  | "current"
  | "planned";

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

export interface ProductResult {
  value: string;
  label: string;
}

export interface ProductArchitecture {
  technology: string;
  description: string;
}

export interface ProductDecision {
  title: string;
  decision: string;
  reason: string;
}

export interface ProductChallenge {
  title: string;
  description: string;
}

export interface ProductSolution {
  title: string;
  description: string;
}

export interface ProductLesson {
  title: string;
  description: string;
}

export interface ProductVendorEcosystem {
  available: boolean;
  title: string;
  description: string;
  image: string;
}

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

  summary: string;

  description: string;

  technologies: string[];

  coverImage: string;

  gallery: ProductImage[];

  liveUrl?: string;

  githubUrl?: string;

  metrics: ProductMetrics;

  blueprint?: ProductBlueprint;

  roadmap?: ProductRoadmap[];

  results?: ProductResult[];

  architecture?: ProductArchitecture[];

  engineeringDecisions?: ProductDecision[];

  challenges?: ProductChallenge[];

  solutions?: ProductSolution[];

  lessons?: ProductLesson[];

  vendorEcosystem?: ProductVendorEcosystem;

  vision?: string;

  challenge?: string;
}