-- ============================================
-- URL UPDATE SCRIPT
-- Run this AFTER uploading files to your new Supabase project
-- This updates all storage URLs from the old project to the new one
-- ============================================

-- Update thumbnail_url
UPDATE library_items
SET thumbnail_url = REPLACE(thumbnail_url, 'kkvjdxxrhvcmfavbreso.supabase.co', 'vmlrlopprqgakooqanbu.supabase.co')
WHERE thumbnail_url LIKE '%kkvjdxxrhvcmfavbreso.supabase.co%';

-- Update pdf_url
UPDATE library_items
SET pdf_url = REPLACE(pdf_url, 'kkvjdxxrhvcmfavbreso.supabase.co', 'vmlrlopprqgakooqanbu.supabase.co')
WHERE pdf_url LIKE '%kkvjdxxrhvcmfavbreso.supabase.co%';

-- Update image_url
UPDATE library_items
SET image_url = REPLACE(image_url, 'kkvjdxxrhvcmfavbreso.supabase.co', 'vmlrlopprqgakooqanbu.supabase.co')
WHERE image_url LIKE '%kkvjdxxrhvcmfavbreso.supabase.co%';

-- Update watermark_url
UPDATE library_items
SET watermark_url = REPLACE(watermark_url, 'kkvjdxxrhvcmfavbreso.supabase.co', 'vmlrlopprqgakooqanbu.supabase.co')
WHERE watermark_url LIKE '%kkvjdxxrhvcmfavbreso.supabase.co%';

-- Update additional_images array
UPDATE library_items
SET additional_images = (
  SELECT array_agg(
    REPLACE(img, 'kkvjdxxrhvcmfavbreso.supabase.co', 'vmlrlopprqgakooqanbu.supabase.co')
  )
  FROM unnest(additional_images) AS img
)
WHERE array_length(additional_images, 1) > 0;

-- Verify the update
SELECT 
  COUNT(*) FILTER (WHERE thumbnail_url LIKE '%kkvjdxxrhvcmfavbreso%') AS old_thumbnail_urls,
  COUNT(*) FILTER (WHERE pdf_url LIKE '%kkvjdxxrhvcmfavbreso%') AS old_pdf_urls,
  COUNT(*) FILTER (WHERE image_url LIKE '%kkvjdxxrhvcmfavbreso%') AS old_image_urls,
  COUNT(*) AS total_items
FROM library_items;
