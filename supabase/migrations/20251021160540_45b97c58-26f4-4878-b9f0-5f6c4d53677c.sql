-- Add new fields to library_items table
ALTER TABLE public.library_items 
ADD COLUMN year_en text,
ADD COLUMN year_mk text,
ADD COLUMN type_en text,
ADD COLUMN type_mk text,
ADD COLUMN source_en text,
ADD COLUMN source_mk text;

-- Update existing year data to year_en
UPDATE public.library_items 
SET year_en = year, year_mk = year
WHERE year IS NOT NULL;

-- Make year nullable since we're moving to language-specific fields
ALTER TABLE public.library_items 
ALTER COLUMN year DROP NOT NULL;