-- Drop the view that depends on the year column
DROP VIEW IF EXISTS public.public_library_items;

-- Change year column from integer to text to allow text input
ALTER TABLE public.library_items 
ALTER COLUMN year TYPE text USING year::text;

-- Recreate the public_library_items view
CREATE OR REPLACE VIEW public.public_library_items AS
SELECT 
  id,
  type,
  title_mk,
  title_en,
  author,
  author_en,
  year,
  language,
  keywords,
  category,
  description_mk,
  description_en,
  thumbnail_url,
  pdf_url,
  image_url,
  additional_images,
  publication_city,
  publication_city_en,
  publisher,
  publisher_en,
  created_at,
  updated_at
FROM public.library_items;