-- Update book categories to match the actual lowercase values in the data
UPDATE library_categories
SET value = lower(value)
WHERE type = 'book';

-- Also ensure consistency - update any library_items that have the capitalized 'History'
-- to use the lowercase 'history' to avoid duplicates
UPDATE library_items
SET category = array_replace(category, 'History', 'history')
WHERE 'History' = ANY(category) AND type = 'book';