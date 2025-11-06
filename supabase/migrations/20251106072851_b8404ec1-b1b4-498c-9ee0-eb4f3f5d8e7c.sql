-- Drop and recreate the public_library_items view to include issue number fields
DROP VIEW IF EXISTS public_library_items;

CREATE VIEW public_library_items AS
SELECT 
  id,
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
  publisher_en,
  issue_number_mk,
  issue_number_en,
  created_at,
  updated_at
FROM library_items;