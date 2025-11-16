-- Phase 1: Extend affiliate_blocks table to support all block types
ALTER TABLE public.affiliate_blocks
ADD COLUMN IF NOT EXISTS block_type TEXT DEFAULT 'affiliate' CHECK (block_type IN ('internal', 'affiliate')),
ADD COLUMN IF NOT EXISTS internal_route TEXT,
ADD COLUMN IF NOT EXISTS pricing_type TEXT DEFAULT 'free' CHECK (pricing_type IN ('free', 'one_time', 'monthly')),
ADD COLUMN IF NOT EXISTS price_cents INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS monthly_price_cents INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS stripe_price_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_monthly_price_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_product_id TEXT,
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Update existing affiliate blocks to have correct block_type
UPDATE public.affiliate_blocks SET block_type = 'affiliate' WHERE block_type IS NULL;

-- Add Lovable Website Builder as affiliate block
INSERT INTO public.affiliate_blocks (
  name,
  subtitle,
  category,
  description,
  logo_url,
  affiliate_link,
  block_type,
  pricing_type,
  is_active,
  tags,
  display_order,
  is_featured
) VALUES (
  'Lovable Website Builder',
  'AI Website Builder',
  'Partnership',
  'Build beautiful websites with AI - no coding required. Just describe what you want and watch it come to life with the most powerful AI web builder',
  '/lovable-icon.png',
  'https://lovable.dev/?via=Acari',
  'affiliate',
  'free',
  true,
  ARRAY['website', 'ai', 'nocode', 'builder', 'partner'],
  0,
  true
) ON CONFLICT DO NOTHING;

-- Migrate internal blocks from blocks_pricing
INSERT INTO public.affiliate_blocks (
  name,
  subtitle,
  category,
  description,
  logo_url,
  block_type,
  internal_route,
  pricing_type,
  price_cents,
  monthly_price_cents,
  stripe_price_id,
  stripe_monthly_price_id,
  stripe_product_id,
  is_active,
  display_order
)
SELECT 
  bp.block_name as name,
  CASE 
    WHEN bp.block_name = 'Logo Generation' THEN 'Brand Identity'
    WHEN bp.block_name = 'Business Plan Generator' THEN 'Strategic Planning'
    WHEN bp.block_name = 'Business Name Generator' THEN 'Brand Naming'
    WHEN bp.block_name = 'Email Signature Generator' THEN 'Professional Communications'
    WHEN bp.block_name = 'QR Code Generator' THEN 'Marketing Tools'
    WHEN bp.block_name = 'Social Media Checker' THEN 'Brand Availability'
    ELSE 'Business Tool'
  END as subtitle,
  CASE 
    WHEN bp.block_name IN ('Logo Generation', 'Business Name Generator', 'Email Signature Generator') THEN 'Brand'
    WHEN bp.block_name IN ('Business Plan Generator') THEN 'Foundation'
    WHEN bp.block_name IN ('QR Code Generator', 'Social Media Checker') THEN 'Growth'
    ELSE 'Foundation'
  END as category,
  COALESCE(bp.description, 'Professional ' || bp.block_name || ' tool to help build and grow your business') as description,
  CASE 
    WHEN bp.block_name = 'Logo Generation' THEN '/logo-generator-icon.png'
    WHEN bp.block_name = 'Business Plan Generator' THEN '/business-plan-icon.png'
    WHEN bp.block_name = 'Business Name Generator' THEN '/business-name-icon.png'
    WHEN bp.block_name = 'Email Signature Generator' THEN '/email-signature-icon.png'
    WHEN bp.block_name = 'QR Code Generator' THEN '/qr-code-icon.jpg'
    WHEN bp.block_name = 'Social Media Checker' THEN '/social-media-icon.png'
    ELSE '/acari-logo.png'
  END as logo_url,
  'internal' as block_type,
  CASE 
    WHEN bp.block_name = 'Logo Generation' THEN '/dashboard/logo-generation'
    WHEN bp.block_name = 'Business Plan Generator' THEN '/dashboard/business-plan'
    WHEN bp.block_name = 'Business Name Generator' THEN '/dashboard/business-name'
    WHEN bp.block_name = 'Email Signature Generator' THEN '/dashboard/email-signature'
    WHEN bp.block_name = 'QR Code Generator' THEN '/dashboard/qr-code'
    WHEN bp.block_name = 'Social Media Checker' THEN '/dashboard/social-media-checker'
  END as internal_route,
  bp.pricing_type,
  bp.price_cents,
  bp.monthly_price_cents,
  bp.stripe_price_id,
  bp.stripe_monthly_price_id,
  bp.stripe_product_id,
  true as is_active,
  0 as display_order
FROM public.blocks_pricing bp
WHERE NOT EXISTS (
  SELECT 1 FROM public.affiliate_blocks ab 
  WHERE ab.name = bp.block_name AND ab.block_type = 'internal'
);

-- Update Tailor Brands logo URL to ensure consistency
UPDATE public.affiliate_blocks 
SET logo_url = '/tailor-brands-logo.png'
WHERE name = 'Tailor Brands' AND (logo_url IS NULL OR logo_url = '');

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_affiliate_blocks_type ON public.affiliate_blocks(block_type);
CREATE INDEX IF NOT EXISTS idx_affiliate_blocks_active ON public.affiliate_blocks(is_active);
CREATE INDEX IF NOT EXISTS idx_affiliate_blocks_category ON public.affiliate_blocks(category);