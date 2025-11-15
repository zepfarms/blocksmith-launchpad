export interface WebsiteTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  previewImage: string;
  livePreviewUrl?: string; // URL to live React template
  colorScheme: string[];
  features: string[];
}

export const websiteTemplates: WebsiteTemplate[] = [
  {
    id: 'plumbing',
    name: 'Plumbing Pro',
    category: 'Home Services',
    description: 'Professional template for plumbers with emergency service focus and trust-building features',
    previewImage: '/templates/plumbing/index.html',
    livePreviewUrl: '/templates/plumbing',
    colorScheme: ['#0066cc', '#004d99', '#ff6b35'],
    features: ['24/7 Emergency CTA', 'Service Grid', 'Quote Form', 'Trust Badges', 'Mobile Optimized']
  },
  {
    id: 'local-business',
    name: 'Local Business Pro',
    category: 'Local Services',
    description: 'Perfect for electricians, HVAC, and home service professionals',
    previewImage: '/templates/local-business/index.html',
    livePreviewUrl: '/templates/local-business',
    colorScheme: ['#1a365d', '#2563eb', '#60a5fa'],
    features: ['Emergency CTA', '24/7 Badge', 'Service Grid', 'Trust Signals', 'Contact Form']
  },
  {
    id: 'professional-services',
    name: 'Professional Edge',
    category: 'Professional Services',
    description: 'Ideal for consultants, lawyers, accountants, and business professionals',
    previewImage: '/templates/professional-services/index.html',
    livePreviewUrl: '/templates/professional-services',
    colorScheme: ['#111827', '#6366f1', '#c7d2fe'],
    features: ['Modern Design', 'Expertise Showcase', 'Case Studies', 'Professional Layout', 'Lead Capture']
  },
  {
    id: 'restaurant',
    name: 'Restaurant Deluxe',
    category: 'Food & Beverage',
    description: 'Stunning design for restaurants, cafes, bakeries, and food businesses',
    previewImage: '/templates/restaurant/index.html',
    livePreviewUrl: '/templates/restaurant',
    colorScheme: ['#dc2626', '#f59e0b', '#fef3c7'],
    features: ['Menu Showcase', 'Reservation System', 'Image Gallery', 'Hours Display', 'Location Map']
  },
  {
    id: 'salon-spa',
    name: 'Beauty & Wellness',
    category: 'Beauty & Wellness',
    description: 'Elegant template for salons, spas, and wellness centers',
    previewImage: '/templates/salon-spa/index.html',
    livePreviewUrl: '/templates/salon-spa',
    colorScheme: ['#be185d', '#ec4899', '#fbcfe8'],
    features: ['Service Menu', 'Booking CTA', 'Team Showcase', 'Premium Design', 'Treatment Gallery']
  },
  {
    id: 'medical',
    name: 'Medical Practice',
    category: 'Healthcare',
    description: 'Professional template for doctors, dentists, and medical practices',
    previewImage: '/templates/medical/index.html',
    livePreviewUrl: '/templates/medical',
    colorScheme: ['#0066cc', '#00a896', '#e0f2fe'],
    features: ['Appointment Booking', 'Services Grid', 'Trust Badges', 'Office Hours', 'Patient Forms']
  },
  {
    id: 'retail',
    name: 'Retail Showcase',
    category: 'Retail & E-commerce',
    description: 'Eye-catching design for retail stores and product showcases',
    previewImage: '/templates/retail/index.html',
    livePreviewUrl: '/templates/retail',
    colorScheme: ['#e63946', '#f77f00', '#fef3c7'],
    features: ['Product Grid', 'Shopping Cart', 'Category Browse', 'Testimonials', 'Free Shipping Badge']
  },
  {
    id: 'fitness',
    name: 'Fitness Studio',
    category: 'Fitness & Sports',
    description: 'Energetic template for gyms, fitness studios, and personal trainers',
    previewImage: '/templates/fitness/index.html',
    livePreviewUrl: '/templates/fitness',
    colorScheme: ['#ff6b35', '#4ecdc4', '#1a1a1a'],
    features: ['Class Schedule', 'Program Grid', 'Free Trial CTA', 'Membership Plans', 'Trainer Profiles']
  },
  {
    id: 'real-estate',
    name: 'Real Estate Agent',
    category: 'Real Estate',
    description: 'Professional template for real estate agents and property listings',
    previewImage: '/templates/real-estate/index.html',
    livePreviewUrl: '/templates/real-estate',
    colorScheme: ['#2563eb', '#10b981', '#f3f4f6'],
    features: ['Property Listings', 'Agent Bio', 'Viewing Scheduler', 'MLS Integration Ready', 'Search Filters']
  },
  {
    id: 'automotive',
    name: 'Auto Services Pro',
    category: 'Automotive',
    description: 'Bold, modern design for auto repair shops, detailing, and car services',
    previewImage: '/templates/automotive/index.html',
    livePreviewUrl: '/templates/automotive',
    colorScheme: ['#dc2626', '#1a1a1a', '#f3f4f6'],
    features: ['Service Menu', 'Appointment Booking', 'Vehicle Type Selector', 'Contact Form', 'Mobile Responsive', 'Modern UI']
  },
  {
    id: 'creative',
    name: 'Creative Portfolio',
    category: 'Creative & Design',
    description: 'Stylish portfolio for designers, photographers, and creative professionals',
    previewImage: '/templates/creative/index.html',
    colorScheme: ['#8b5cf6', '#ec4899', '#f5f3ff'],
    features: ['Portfolio Grid', 'Project Showcase', 'About Section', 'Contact Form', 'Smooth Animations']
  }
];
