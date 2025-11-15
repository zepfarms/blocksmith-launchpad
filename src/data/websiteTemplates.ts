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
    id: 'restaurant',
    name: 'Restaurant Deluxe',
    category: 'Food & Beverage',
    description: 'Stunning design for restaurants, cafes, bakeries, and food businesses',
    previewImage: '/placeholder.svg',
    livePreviewUrl: '/templates/restaurant',
    colorScheme: ['#dc2626', '#f59e0b', '#fef3c7'],
    features: ['Menu Showcase', 'Reservation System', 'Image Gallery', 'Hours Display', 'Location Map']
  },
  {
    id: 'automotive',
    name: 'Auto Services Pro',
    category: 'Automotive',
    description: 'Bold, modern design for auto repair shops, detailing, and car services',
    previewImage: '/placeholder.svg',
    livePreviewUrl: '/templates/automotive',
    colorScheme: ['#dc2626', '#1a1a1a', '#f3f4f6'],
    features: ['Service Menu', 'Appointment Booking', 'Vehicle Type Selector', 'Contact Form', 'Mobile Responsive', 'Modern UI']
  }
];
