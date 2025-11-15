-- Create storage bucket for business assets (logos, photos, banners)
INSERT INTO storage.buckets (id, name, public)
VALUES ('business-assets', 'business-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for business-assets bucket
CREATE POLICY "Users can upload their own business assets"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'business-assets' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own business assets"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'business-assets' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own business assets"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'business-assets' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own business assets"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'business-assets' AND
  auth.uid()::text = (storage.foldername(name))[1]
);