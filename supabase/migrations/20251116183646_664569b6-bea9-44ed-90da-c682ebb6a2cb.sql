-- Create business_ideas table
CREATE TABLE IF NOT EXISTS public.business_ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  starter_blocks TEXT NOT NULL,
  growth_blocks TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.business_ideas ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Anyone can view active business ideas"
  ON public.business_ideas
  FOR SELECT
  USING (is_active = true);

-- Create policy for admins to manage business ideas
CREATE POLICY "Admins can manage business ideas"
  ON public.business_ideas
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index on category for faster filtering
CREATE INDEX idx_business_ideas_category ON public.business_ideas(category);
CREATE INDEX idx_business_ideas_active ON public.business_ideas(is_active);