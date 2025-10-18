-- Change language column from text to text array to support multiple languages
ALTER TABLE library_items 
ALTER COLUMN language TYPE text[] 
USING ARRAY[language];

-- Update existing records to use new language codes
UPDATE library_items
SET language = ARRAY['Macedonian']
WHERE language = ARRAY['mk'];

UPDATE library_items
SET language = ARRAY['English']
WHERE language = ARRAY['en'];

UPDATE library_items
SET language = ARRAY['Other']
WHERE language = ARRAY['other'];

-- Set default value for new records
ALTER TABLE library_items 
ALTER COLUMN language SET DEFAULT '{}'::text[];