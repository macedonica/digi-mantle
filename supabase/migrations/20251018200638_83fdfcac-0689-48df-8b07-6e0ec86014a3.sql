-- Create a public view that excludes the uploaded_by field
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
  description_mk,
  description_en,
  thumbnail_url,
  pdf_url,
  image_url,
  category,
  publication_city,
  publication_city_en,
  publisher,
  publisher_en,
  created_at,
  updated_at
FROM public.library_items;

-- Grant SELECT access on the view to everyone
GRANT SELECT ON public.public_library_items TO anon, authenticated;

-- Update the library_items table RLS policy to restrict public access
-- Only allow public to read through the view, admins get full access
DROP POLICY IF EXISTS "Anyone can view library items" ON public.library_items;

CREATE POLICY "Only admins can view library items table directly"
ON public.library_items
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));