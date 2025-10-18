-- Add English versions for author, publisher, and publication city
ALTER TABLE public.library_items 
ADD COLUMN author_en TEXT,
ADD COLUMN publisher_en TEXT,
ADD COLUMN publication_city_en TEXT;

-- Update existing records to copy current values to both MK and EN fields
UPDATE public.library_items 
SET author_en = author,
    publisher_en = publisher,
    publication_city_en = publication_city;