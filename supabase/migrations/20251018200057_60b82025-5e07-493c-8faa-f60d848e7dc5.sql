-- Update existing category values to new categories
UPDATE public.library_items 
SET category = CASE 
  WHEN category = 'history' THEN 'history'
  WHEN category = 'culture' THEN 'ethnology'
  WHEN category = 'poetry' THEN 'literature'
  WHEN category = 'personalities' THEN 'history'
  WHEN category = 'geography' THEN 'archaeology'
  ELSE 'history'
END;