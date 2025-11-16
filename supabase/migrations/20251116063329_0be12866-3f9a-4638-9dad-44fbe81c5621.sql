-- Create affiliate blocks table
CREATE TABLE public.affiliate_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  subtitle TEXT,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  logo_url TEXT,
  affiliate_link TEXT,
  is_affiliate BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  tags TEXT[],
  click_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create affiliate clicks tracking table
CREATE TABLE public.affiliate_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  block_id UUID REFERENCES public.affiliate_blocks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT
);

-- Enable RLS
ALTER TABLE public.affiliate_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_clicks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for affiliate_blocks
CREATE POLICY "Anyone can view active blocks"
  ON public.affiliate_blocks
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage all blocks"
  ON public.affiliate_blocks
  FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for affiliate_clicks
CREATE POLICY "Anyone can insert clicks"
  ON public.affiliate_clicks
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all clicks"
  ON public.affiliate_clicks
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_affiliate_blocks_updated_at
  BEFORE UPDATE ON public.affiliate_blocks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();