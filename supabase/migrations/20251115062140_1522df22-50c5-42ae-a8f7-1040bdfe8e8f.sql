-- Create user_websites table for Domain + Website block
CREATE TABLE IF NOT EXISTS public.user_websites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  business_id uuid REFERENCES user_businesses(id) ON DELETE SET NULL,
  
  -- Domain info
  domain_name text UNIQUE NOT NULL,
  domain_owned_externally boolean NOT NULL DEFAULT false,
  domain_verified boolean NOT NULL DEFAULT false,
  domain_purchase_date timestamptz,
  domain_expiry_date timestamptz,
  
  -- Website info
  template_id text NOT NULL,
  customization_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  
  -- Cloudflare info
  cloudflare_deployment_id text,
  cloudflare_domain_id text,
  cloudflare_pages_url text,
  
  -- Status and payment
  status text NOT NULL DEFAULT 'draft', -- 'draft', 'verifying', 'deploying', 'active', 'suspended', 'expired'
  one_time_fee_paid boolean DEFAULT false,
  subscription_id uuid REFERENCES user_subscriptions(id) ON DELETE SET NULL,
  
  -- Metadata
  site_content jsonb DEFAULT '{}'::jsonb,
  analytics_data jsonb DEFAULT '{}'::jsonb,
  
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_websites ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own websites"
  ON public.user_websites
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own websites"
  ON public.user_websites
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own websites"
  ON public.user_websites
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own websites"
  ON public.user_websites
  FOR DELETE
  USING (auth.uid() = user_id);

-- Admins can view all
CREATE POLICY "Admins can view all websites"
  ON public.user_websites
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_user_websites_updated_at
  BEFORE UPDATE ON public.user_websites
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Update blocks_pricing for Domain + Website block
INSERT INTO public.blocks_pricing (
  block_name,
  is_free,
  pricing_type,
  price_cents, -- This is the monthly subscription price
  monthly_price_cents,
  description
) VALUES (
  'Domain + Website',
  false,
  'monthly',
  1000, -- $10/month subscription
  1000, -- $10/month
  'Custom domain with professional website template, hosting, and AI-powered editing'
) ON CONFLICT (block_name) DO UPDATE SET
  pricing_type = EXCLUDED.pricing_type,
  price_cents = EXCLUDED.price_cents,
  monthly_price_cents = EXCLUDED.monthly_price_cents,
  description = EXCLUDED.description;