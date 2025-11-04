-- Add periodical type support to library_categories
ALTER TABLE library_categories DROP CONSTRAINT IF EXISTS library_categories_type_check;
ALTER TABLE library_categories ADD CONSTRAINT library_categories_type_check 
  CHECK (type IN ('book', 'image', 'periodical'));

-- Add periodical type support to library_items
ALTER TABLE library_items DROP CONSTRAINT IF EXISTS library_items_type_check;
ALTER TABLE library_items ADD CONSTRAINT library_items_type_check 
  CHECK (type IN ('book', 'image', 'periodical'));

-- Add issue/newspaper number fields to library_items
ALTER TABLE library_items ADD COLUMN IF NOT EXISTS issue_number_mk text;
ALTER TABLE library_items ADD COLUMN IF NOT EXISTS issue_number_en text;