-- Create enum for document file types
CREATE TYPE document_file_type AS ENUM ('pdf', 'docx', 'google-docs', 'html');

-- Create document categories table
CREATE TABLE document_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create document templates table
CREATE TABLE document_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  category_id UUID REFERENCES document_categories(id) ON DELETE SET NULL,
  file_type document_file_type NOT NULL,
  file_url TEXT, -- Storage URL for PDF/DOCX or Google Docs link
  thumbnail_url TEXT,
  tags TEXT[] DEFAULT '{}',
  is_premium BOOLEAN NOT NULL DEFAULT false,
  is_editable_online BOOLEAN NOT NULL DEFAULT true,
  download_count INTEGER NOT NULL DEFAULT 0,
  view_count INTEGER NOT NULL DEFAULT 0,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create document analytics table
CREATE TABLE document_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES document_templates(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL, -- 'view', 'download', 'edit'
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create user documents table (saved edited versions)
CREATE TABLE user_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  template_id UUID REFERENCES document_templates(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  document_type TEXT NOT NULL, -- 'pdf', 'document'
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create storage bucket for document templates
INSERT INTO storage.buckets (id, name, public)
VALUES ('document-templates', 'document-templates', true);

-- Enable RLS on all tables
ALTER TABLE document_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for document_categories
CREATE POLICY "Anyone can view categories"
  ON document_categories FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage categories"
  ON document_categories FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for document_templates
CREATE POLICY "Anyone can view published templates"
  ON document_templates FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage templates"
  ON document_templates FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for document_analytics
CREATE POLICY "Anyone can insert analytics"
  ON document_analytics FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view analytics"
  ON document_analytics FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for user_documents
CREATE POLICY "Users can view their own documents"
  ON user_documents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own documents"
  ON user_documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents"
  ON user_documents FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents"
  ON user_documents FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all documents"
  ON user_documents FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Storage policies for document-templates bucket
CREATE POLICY "Public can view document templates"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'document-templates');

CREATE POLICY "Admins can upload document templates"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'document-templates' 
    AND has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Admins can update document templates"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'document-templates'
    AND has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Admins can delete document templates"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'document-templates'
    AND has_role(auth.uid(), 'admin'::app_role)
  );

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_document_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_document_categories_updated_at
  BEFORE UPDATE ON document_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_document_updated_at();

CREATE TRIGGER update_document_templates_updated_at
  BEFORE UPDATE ON document_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_document_updated_at();

CREATE TRIGGER update_user_documents_updated_at
  BEFORE UPDATE ON user_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_document_updated_at();

-- Insert default categories
INSERT INTO document_categories (name, slug, description, icon, display_order) VALUES
  ('Contracts & Legal', 'contracts-legal', 'Service agreements, NDAs, contracts, and legal templates', '📄', 1),
  ('Financial & Invoices', 'financial-invoices', 'Invoices, receipts, financial statements, and tax forms', '💰', 2),
  ('Business Planning', 'business-planning', 'Business plans, pitch decks, and strategic planning templates', '📊', 3),
  ('Marketing & Proposals', 'marketing-proposals', 'Proposals, marketing materials, and sales documents', '📧', 4),
  ('HR & Operations', 'hr-operations', 'HR forms, job descriptions, employee handbooks, and SOPs', '📋', 5),
  ('Tax Forms', 'tax-forms', 'W-9, 1099, and other tax-related forms', '📝', 6);