// TypeScript type definitions for the application

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'org-admin';
  createdAt: string;
  updatedAt: string;
}

// Demo Request type
export interface DemoRequest {
  id?: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  cloudProvider: string;
  budget: string;
  message: string;
  createdAt?: string;
}

// Component Props types
export interface LayoutProps {
  children: React.ReactNode;
}

export interface PageProps {
  title: string;
  description?: string;
}

// Environment variables type
export interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_API_ENDPOINT: string;
  readonly VITE_GOOGLE_GA_ID: string;
  readonly VITE_GTM_ID: string;
  readonly VITE_FACEBOOK_PIXEL_ID: string;
  readonly VITE_INDEXNOW_KEY: string;
}

// Form types
export interface FormState {
  isLoading: boolean;
  error?: string;
  success: boolean;
}

// SEO types
export interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
}
