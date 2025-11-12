-- Drop and recreate the public_library_items view to include watermark_url
DROP VIEW IF EXISTS public.public_library_items;

CREATE VIEW public.public_library_items AS
SELECT 
  id,
  created_at,
  updated_at,
  type,
  title_mk,
  title_en,
  author,
  author_en,
  year,
  year_mk,
  year_en,
  type_mk,
  type_en,
  source_mk,
  source_en,
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
  issue_number_mk,
  issue_number_en,
  publisher_en,
  watermark_url
FROM library_items;

COMMENT ON VIEW public.public_library_items IS 'Public view of library items excluding sensitive uploaded_by field';