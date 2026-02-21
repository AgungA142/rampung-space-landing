export interface Portfolio {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  slug: string;
  challenge: string;
  solution: string;
  tech_stack: string[];
  tags: string[];
  thumbnail_url?: string;
  images?: string[];
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
}

export interface PortfolioFormData {
  title: string;
  slug: string;
  challenge: string;
  solution: string;
  tech_stack: string[];
  tags: string[];
  thumbnail_url?: string;
  images?: string[];
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
}
