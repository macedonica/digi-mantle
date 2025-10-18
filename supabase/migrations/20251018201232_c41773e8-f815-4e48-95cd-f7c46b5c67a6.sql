-- Fix critical storage security issues
-- Make storage buckets private and add RLS policies

-- Step 1: Make buckets private to prevent unrestricted public access
UPDATE storage.buckets 
SET public = false 
WHERE id IN ('library-images', 'library-pdfs');

-- Step 2: Add RLS policies for controlled access to storage.objects

-- Allow public read access to library files (anyone can view/download)
CREATE POLICY "Public read access for library files"
ON storage.objects FOR SELECT
USING (bucket_id IN ('library-images', 'library-pdfs'));

-- Only admins can upload files
CREATE POLICY "Admins can upload library files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id IN ('library-images', 'library-pdfs') 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Only admins can update files
CREATE POLICY "Admins can update library files"
ON storage.objects FOR UPDATE
USING (
  bucket_id IN ('library-images', 'library-pdfs') 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Only admins can delete files
CREATE POLICY "Admins can delete library files"
ON storage.objects FOR DELETE
USING (
  bucket_id IN ('library-images', 'library-pdfs') 
  AND has_role(auth.uid(), 'admin'::app_role)
);