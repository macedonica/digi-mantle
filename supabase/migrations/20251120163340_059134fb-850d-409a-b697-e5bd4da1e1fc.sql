-- Add watermark_link field to library_items table
ALTER TABLE public.library_items 
ADD COLUMN watermark_link TEXT;