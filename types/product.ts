export interface ProductImage {
  src: string;

  alt: string;

  title: string;

  subtitle?: string;

  description: string;

  impact?: string;
}

export interface ProductFeatureModule {
  title: string;
  description?: string;
}

export interface ProductFeatureHighlight {
  available: boolean;
  title: string;
  description: string;
  image: string;
  modules?: ProductFeatureModule[];
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


export interface ProductEvolutionStep {
  title: string;
  description: string;
}

export interface ProductEvolution {
  available: boolean;
  title: string;
  description: string;
  steps: ProductEvolutionStep[];
}



export interface ProductEcosystemGroup {
  title: string;
  description: string;
  features: string[];
}

export interface ProductEcosystem {
  available: boolean;
  title: string;
  description: string;
  groups: ProductEcosystemGroup[];
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



export interface Product {

  showEngineeringJourney?: boolean;

  slug: string;

  title: string;

  headline: string;

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

  featureHighlight?: ProductFeatureHighlight;

  ecosystem?: ProductEcosystem;

  vision?: string;

  challenge?: string;

  evolution?: ProductEvolution;
}