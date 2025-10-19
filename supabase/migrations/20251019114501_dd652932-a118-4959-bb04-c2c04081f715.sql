-- Drop the dependent view
DROP VIEW IF EXISTS public.public_library_items;

-- Convert category column from text to text array
ALTER TABLE library_items 
ALTER COLUMN category TYPE text[] 
USING CASE 
  WHEN category IS NULL OR category = '' THEN '{}'::text[]
  ELSE ARRAY[category]::text[]
END;

-- Set default to empty array  
ALTER TABLE library_items 
ALTER COLUMN category SET DEFAULT '{}'::text[];

-- Recreate the public view without the uploaded_by field
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
  category
FROM library_items;