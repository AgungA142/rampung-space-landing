export interface Testimonial {
  id: string;
  created_at: string;
  updated_at: string;
  client_name: string;
  client_company?: string;
  client_position?: string;
  avatar_url?: string;
  quote: string;
  rating: number;
  is_published: boolean;
  sort_order: number;
}

export interface TestimonialFormData {
  client_name: string;
  client_company?: string;
  client_position?: string;
  avatar_url?: string;
  quote: string;
  rating: number;
  is_published: boolean;
  sort_order: number;
}
