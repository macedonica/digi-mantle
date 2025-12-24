-- ============================================
-- LIBRARY CATEGORIES DATA EXPORT
-- Run this in your new Supabase SQL Editor
-- ============================================

-- Clear existing data (optional - remove if you want to keep existing)
-- DELETE FROM library_categories;

INSERT INTO library_categories (id, name_mk, name_en, value, type, sort_order, is_active, created_at) VALUES
('de2f1585-d0e1-48d6-aab1-25593875a919', 'Весник', 'Newspaper', 'Newspaper', 'image', 1, true, '2025-10-28 20:15:45.756446+00'),
('b70e2889-d1a5-4f95-9c00-a0c29ff16820', 'Историја', 'History', 'history', 'book', 1, true, '2025-10-28 20:15:45.756446+00'),
('742c7309-53db-440b-9f06-0d10dd98b5c2', 'Документ', 'Document', 'Document', 'image', 2, true, '2025-10-28 20:15:45.756446+00'),
('b38c4889-d2d5-4fd8-a7b8-fb31dc9d8ba7', 'Археологија', 'Archaeology', 'archaeology', 'book', 2, true, '2025-10-28 20:15:45.756446+00'),
('2ba46c4a-684e-4d2c-8efe-04969ca2c624', 'Литература', 'Literature', 'literature', 'book', 3, true, '2025-10-28 20:15:45.756446+00'),
('15c983e2-89c0-4fde-b291-6c1e1f460a45', 'Мапа', 'Map', 'Map', 'image', 3, true, '2025-10-28 20:15:45.756446+00'),
('80476b59-8711-45de-ba03-9f1a3d6016df', 'Етнологија', 'Ethnology', 'ethnology', 'book', 4, true, '2025-10-28 20:15:45.756446+00'),
('6166b42c-f849-4256-ad02-49bd5ebf35b4', 'Артефакт', 'Artefact', 'Artefact', 'image', 4, true, '2025-10-28 20:15:45.756446+00'),
('4483e7f2-ae3c-4db9-9601-f005819aed90', 'Фолклор', 'Folklore', 'folklore', 'book', 5, true, '2025-10-28 20:15:45.756446+00'),
('8bcef828-071c-48bd-ab66-133f28edff49', 'Ракопис', 'Manuscript', 'Manuscript', 'image', 5, true, '2025-10-28 20:15:45.756446+00'),
('56c82593-e147-433c-980b-414883516c07', 'Книга', 'Book', 'Book', 'image', 6, true, '2025-10-28 20:15:45.756446+00'),
('f7cc1142-1c4f-4c13-a265-e359a6de2586', 'Фотографија', 'Photo', 'Photo', 'image', 7, true, '2025-10-28 20:15:45.756446+00')
ON CONFLICT (id) DO UPDATE SET
  name_mk = EXCLUDED.name_mk,
  name_en = EXCLUDED.name_en,
  value = EXCLUDED.value,
  type = EXCLUDED.type,
  sort_order = EXCLUDED.sort_order,
  is_active = EXCLUDED.is_active;
