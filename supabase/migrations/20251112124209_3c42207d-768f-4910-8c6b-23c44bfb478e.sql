-- Create blocks_pricing table to store individual block pricing
CREATE TABLE public.blocks_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  block_name TEXT NOT NULL UNIQUE,
  price_cents INTEGER NOT NULL DEFAULT 0,
  is_free BOOLEAN NOT NULL DEFAULT false,
  stripe_price_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on blocks_pricing
ALTER TABLE public.blocks_pricing ENABLE ROW LEVEL SECURITY;

-- Everyone can read pricing (needed for block selection)
CREATE POLICY "Anyone can view block pricing"
  ON public.blocks_pricing
  FOR SELECT
  USING (true);

-- Only admins can insert pricing
CREATE POLICY "Admins can insert block pricing"
  ON public.blocks_pricing
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- Only admins can update pricing
CREATE POLICY "Admins can update block pricing"
  ON public.blocks_pricing
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

-- Only admins can delete pricing
CREATE POLICY "Admins can delete block pricing"
  ON public.blocks_pricing
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

-- Create user_block_purchases table to track purchases
CREATE TABLE public.user_block_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  block_name TEXT NOT NULL,
  price_paid_cents INTEGER NOT NULL,
  stripe_payment_intent_id TEXT,
  purchased_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on user_block_purchases
ALTER TABLE public.user_block_purchases ENABLE ROW LEVEL SECURITY;

-- Users can view their own purchases
CREATE POLICY "Users can view their own purchases"
  ON public.user_block_purchases
  FOR SELECT
  USING (auth.uid() = user_id);

-- System can insert purchases (from edge functions)
CREATE POLICY "System can insert purchases"
  ON public.user_block_purchases
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can view all purchases
CREATE POLICY "Admins can view all purchases"
  ON public.user_block_purchases
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- Add payment tracking columns to user_businesses
ALTER TABLE public.user_businesses
  ADD COLUMN total_cost_cents INTEGER DEFAULT 0,
  ADD COLUMN payment_status TEXT DEFAULT 'pending',
  ADD COLUMN stripe_session_id TEXT;

-- Create trigger to update blocks_pricing updated_at
CREATE TRIGGER update_blocks_pricing_updated_at
  BEFORE UPDATE ON public.blocks_pricing
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();