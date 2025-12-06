-- Drop the existing security definer view
DROP VIEW IF EXISTS public.public_library_items;

-- Recreate the view with SECURITY INVOKER (default, explicit for clarity)
-- This ensures RLS policies of the querying user are applied
CREATE VIEW public.public_library_items 
WITH (security_invoker = true)
AS
SELECT 
  id,
  created_at,
  updated_at,
  publication_city,
  publication_city_en,
  publisher,
  publisher_en,
  issue_number_mk,
  issue_number_en,
  watermark_url,
  watermark_link,
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
  additional_images
FROM public.library_items;

-- Grant SELECT to anon and authenticated roles so public can read
GRANT SELECT ON public.public_library_items TO anon;
GRANT SELECT ON public.public_library_items TO authenticated;