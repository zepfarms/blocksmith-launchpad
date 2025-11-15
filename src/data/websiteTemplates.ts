export interface WebsiteTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  previewImage: string;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
  features: string[];
}

export const websiteTemplates: WebsiteTemplate[] = [
  {
    id: 'local-business',
    name: 'Local Business Pro',
    category: 'Local Services',
    description: 'Perfect for plumbers, electricians, handymen, and local contractors',
    previewImage: '🏠',
    colorScheme: {
      primary: '#2563eb',
      secondary: '#1e40af',
      accent: '#f59e0b',
    },
    features: ['Contact Form', 'Service Areas Map', 'Testimonials', 'Call-to-Action'],
  },
  {
    id: 'professional-services',
    name: 'Professional Edge',
    category: 'Professional Services',
    description: 'Ideal for lawyers, accountants, consultants, and professional firms',
    previewImage: '💼',
    colorScheme: {
      primary: '#0f172a',
      secondary: '#334155',
      accent: '#3b82f6',
    },
    features: ['Team Bios', 'Case Studies', 'Contact Form', 'Service Showcase'],
  },
  {
    id: 'restaurant',
    name: 'Restaurant Deluxe',
    category: 'Food & Dining',
    description: 'Great for restaurants, cafes, bakeries, and food trucks',
    previewImage: '🍽️',
    colorScheme: {
      primary: '#dc2626',
      secondary: '#991b1b',
      accent: '#fbbf24',
    },
    features: ['Menu Display', 'Hours & Location', 'Photo Gallery', 'Online Ordering Link'],
  },
  {
    id: 'salon-spa',
    name: 'Beauty & Wellness',
    category: 'Beauty & Wellness',
    description: 'Perfect for salons, spas, barbershops, and wellness centers',
    previewImage: '💅',
    colorScheme: {
      primary: '#ec4899',
      secondary: '#be185d',
      accent: '#8b5cf6',
    },
    features: ['Service Menu', 'Booking Link', 'Gallery', 'Staff Showcase'],
  },
  {
    id: 'medical',
    name: 'Medical Practice',
    category: 'Healthcare',
    description: 'Designed for doctors, dentists, chiropractors, and medical offices',
    previewImage: '⚕️',
    colorScheme: {
      primary: '#059669',
      secondary: '#047857',
      accent: '#10b981',
    },
    features: ['Appointment Form', 'Services List', 'Insurance Info', 'Patient Resources'],
  },
  {
    id: 'retail',
    name: 'Retail Showcase',
    category: 'Retail',
    description: 'Perfect for boutiques, gift shops, and specialty retail stores',
    previewImage: '🛍️',
    colorScheme: {
      primary: '#7c3aed',
      secondary: '#6d28d9',
      accent: '#a78bfa',
    },
    features: ['Product Gallery', 'Store Hours', 'Location Map', 'Contact Form'],
  },
  {
    id: 'fitness',
    name: 'Fitness Studio',
    category: 'Fitness',
    description: 'Great for gyms, yoga studios, personal trainers, and fitness centers',
    previewImage: '💪',
    colorScheme: {
      primary: '#ea580c',
      secondary: '#c2410c',
      accent: '#fb923c',
    },
    features: ['Class Schedule', 'Trainer Bios', 'Membership Info', 'Contact Form'],
  },
  {
    id: 'real-estate',
    name: 'Real Estate Agent',
    category: 'Real Estate',
    description: 'Designed for real estate agents and property professionals',
    previewImage: '🏡',
    colorScheme: {
      primary: '#0891b2',
      secondary: '#0e7490',
      accent: '#06b6d4',
    },
    features: ['Property Listings', 'Agent Bio', 'Testimonials', 'Contact Form'],
  },
  {
    id: 'automotive',
    name: 'Auto Services',
    category: 'Automotive',
    description: 'Perfect for auto repair shops, detailing, and car dealerships',
    previewImage: '🚗',
    colorScheme: {
      primary: '#1f2937',
      secondary: '#111827',
      accent: '#ef4444',
    },
    features: ['Services List', 'Appointment Form', 'Photo Gallery', 'Special Offers'],
  },
  {
    id: 'creative',
    name: 'Creative Portfolio',
    category: 'Creative',
    description: 'Ideal for photographers, designers, artists, and creatives',
    previewImage: '🎨',
    colorScheme: {
      primary: '#6366f1',
      secondary: '#4f46e5',
      accent: '#a855f7',
    },
    features: ['Portfolio Gallery', 'About Section', 'Service Packages', 'Contact Form'],
  },
];
