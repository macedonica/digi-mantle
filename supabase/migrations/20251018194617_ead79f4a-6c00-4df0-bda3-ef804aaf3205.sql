-- Add publication city and publisher fields to library_items table
ALTER TABLE public.library_items 
ADD COLUMN publication_city TEXT,
ADD COLUMN publisher TEXT;