-- Add watermark_url column to library_items table
ALTER TABLE public.library_items
ADD COLUMN watermark_url text;

COMMENT ON COLUMN public.library_items.watermark_url IS 'Optional watermark image URL for display on item detail page';