-- Create table for tracking user-edited documents
CREATE TABLE IF NOT EXISTS public.user_edited_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  template_id UUID REFERENCES public.document_templates(id),
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  original_file_url TEXT,
  edit_count INTEGER DEFAULT 1,
  last_edited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_edited_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own edited documents"
  ON public.user_edited_documents
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own edited documents"
  ON public.user_edited_documents
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own edited documents"
  ON public.user_edited_documents
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own edited documents"
  ON public.user_edited_documents
  FOR DELETE
  USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_user_edited_documents_updated_at
  BEFORE UPDATE ON public.user_edited_documents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert PDF Editor into affiliate_blocks (using 'monthly' pricing type)
INSERT INTO public.affiliate_blocks (
  name,
  subtitle,
  category,
  description,
  pricing_type,
  monthly_price_cents,
  block_type,
  internal_route,
  is_affiliate,
  is_active,
  is_featured,
  display_order,
  logo_url
) VALUES (
  'PDF Editor',
  'Edit, annotate, and customize PDFs',
  'Documents',
  'Professional PDF editing with ComPDFKit. Edit text, images, add annotations, fill forms, and more. Try 3 free edits, then upgrade for unlimited access.',
  'monthly',
  500,
  'internal',
  '/dashboard/pdf-editor',
  false,
  true,
  true,
  1,
  '/lovable-logo.png'
)
ON CONFLICT DO NOTHING;