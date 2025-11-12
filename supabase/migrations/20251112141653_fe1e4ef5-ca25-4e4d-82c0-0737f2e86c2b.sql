-- Create block_categories table for admin-defined categories
CREATE TABLE IF NOT EXISTS public.block_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create junction table for many-to-many relationship between blocks and categories
CREATE TABLE IF NOT EXISTS public.block_category_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  block_name TEXT NOT NULL,
  category_id UUID NOT NULL REFERENCES public.block_categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(block_name, category_id)
);

-- Enable RLS
ALTER TABLE public.block_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.block_category_assignments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for block_categories
CREATE POLICY "Anyone can view categories"
  ON public.block_categories
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert categories"
  ON public.block_categories
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update categories"
  ON public.block_categories
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete categories"
  ON public.block_categories
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for block_category_assignments
CREATE POLICY "Anyone can view assignments"
  ON public.block_category_assignments
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert assignments"
  ON public.block_category_assignments
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete assignments"
  ON public.block_category_assignments
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_block_categories_updated_at
  BEFORE UPDATE ON public.block_categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();