-- Add is_featured column to document_templates
ALTER TABLE public.document_templates 
ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false;

-- Create index for faster featured template queries
CREATE INDEX IF NOT EXISTS idx_document_templates_featured 
ON public.document_templates(is_featured) 
WHERE is_featured = true;