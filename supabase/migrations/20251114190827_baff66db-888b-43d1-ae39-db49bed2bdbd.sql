-- Create user_domain_selections table
CREATE TABLE public.user_domain_selections (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  business_id uuid NOT NULL,
  domain_name text,
  has_existing_domain boolean NOT NULL DEFAULT false,
  existing_website_url text,
  registered_via_acari boolean NOT NULL DEFAULT false,
  domain_status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_domain_selections ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own domain selections"
  ON public.user_domain_selections
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own domain selections"
  ON public.user_domain_selections
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own domain selections"
  ON public.user_domain_selections
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_user_domain_selections_updated_at
  BEFORE UPDATE ON public.user_domain_selections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();