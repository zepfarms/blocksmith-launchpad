-- Add columns for alternative file format (second document per template)
ALTER TABLE document_templates 
ADD COLUMN alternative_file_url TEXT,
ADD COLUMN alternative_file_type TEXT;

-- Add check constraint for alternative_file_type
ALTER TABLE document_templates
ADD CONSTRAINT check_alternative_file_type 
CHECK (alternative_file_type IN ('pdf', 'docx', 'google-docs', 'html') OR alternative_file_type IS NULL);

-- Add comment for clarity
COMMENT ON COLUMN document_templates.alternative_file_url IS 'URL for alternative format of the template (e.g., DOCX when main is PDF)';
COMMENT ON COLUMN document_templates.alternative_file_type IS 'File type of the alternative format';