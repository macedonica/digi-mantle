-- Add additional_images column to store multiple image URLs
ALTER TABLE library_items 
ADD COLUMN additional_images text[] DEFAULT '{}';

-- Update the public view to include additional_images
DROP VIEW IF EXISTS public.public_library_items;

CREATE OR REPLACE VIEW public.public_library_items AS
SELECT 
  id,
  created_at,
  updated_at,
  type,
  title_mk,
  title_en,
  author,
  author_en,
  language,
  keywords,
  description_mk,
  description_en,
  thumbnail_url,
  pdf_url,
  image_url,
  year,
  publication_city,
  publication_city_en,
  publisher,
  publisher_en,
  category,
  additional_images
FROM library_items;