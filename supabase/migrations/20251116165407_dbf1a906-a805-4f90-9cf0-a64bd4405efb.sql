-- Create RLS policies for document-templates storage bucket
-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload document templates"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'document-templates');

-- Allow authenticated users to update files
CREATE POLICY "Authenticated users can update document templates"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'document-templates');

-- Allow authenticated users to delete files
CREATE POLICY "Authenticated users can delete document templates"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'document-templates');

-- Allow public read access to document templates
CREATE POLICY "Public can read document templates"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'document-templates');