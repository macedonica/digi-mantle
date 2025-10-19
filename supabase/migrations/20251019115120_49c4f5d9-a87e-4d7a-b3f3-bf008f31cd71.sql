-- Make library-images bucket public so images can be accessed without signed URLs
UPDATE storage.buckets 
SET public = true 
WHERE id = 'library-images';