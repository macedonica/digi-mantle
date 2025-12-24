-- ============================================
-- LIBRARY LANGUAGES DATA EXPORT
-- Run this in your new Supabase SQL Editor
-- ============================================

-- Clear existing data (optional - remove if you want to keep existing)
-- DELETE FROM library_languages;

INSERT INTO library_languages (id, name_mk, name_en, value, sort_order, is_active, created_at) VALUES
('13a30413-43b9-4186-8c10-30b494354ed7', 'Македонски', 'Macedonian', 'Macedonian', 1, true, '2025-10-28 20:15:45.756446+00'),
('b1eaf502-0bda-4e7e-90a5-2f22e02b62bb', 'Англиски', 'English', 'English', 2, true, '2025-10-28 20:15:45.756446+00'),
('9ed1effc-edb5-464e-ab36-4e959f1dbca5', 'Германски', 'German', 'German', 3, true, '2025-10-28 20:15:45.756446+00'),
('5f4162ad-2799-4b74-9f05-2f057d7a79fd', 'Француски', 'French', 'French', 4, true, '2025-10-28 20:15:45.756446+00'),
('0fb39b89-3ff8-4398-9f78-6867ef6e686f', 'Руски', 'Russian', 'Russian', 5, true, '2025-10-28 20:15:45.756446+00'),
('27ffdf13-9f62-4b42-b3a1-ade753f4d498', 'Српски', 'Serbian', 'Serbian', 6, true, '2025-10-28 20:15:45.756446+00'),
('b4015a00-b3a7-4189-ac25-5c8b9f628b6a', 'Бугарски', 'Bulgarian', 'Bulgarian', 7, true, '2025-10-28 20:15:45.756446+00'),
('e6c7c63a-2d2b-4877-ab76-f855f96df4a9', 'Грчки', 'Greek', 'Greek', 8, true, '2025-10-28 20:15:45.756446+00'),
('eb77405b-aba1-4e88-b9cc-0b38a6bbf761', 'Турски', 'Turkish', 'Turkish', 9, true, '2025-10-28 20:15:45.756446+00'),
('9e67e2d3-d2c9-4db7-8b2d-ab9eb0be792b', 'Албански', 'Albanian', 'Albanian', 10, true, '2025-10-28 20:15:45.756446+00'),
('4939c9ea-4655-466c-a0c8-caad65730a38', 'Црковнословенски', 'Church Slavonic', 'Church Slavonic', 11, true, '2025-10-28 20:15:45.756446+00'),
('ec5bb01c-500e-412a-b019-5d6739541798', 'Старословенски', 'Old Church Slavonic', 'Old Church Slavonic', 12, true, '2025-10-28 20:15:45.756446+00'),
('feab1d31-4ff5-4e95-bf16-8e7748d8fb2c', 'Глаголица', 'Glagolitic Script', 'Glagolitic Script', 13, true, '2025-10-28 20:15:45.756446+00'),
('3fdcf6e6-4420-43b4-81e9-af1a239d15df', 'Словенски', 'Slovenian', 'Slovenian', 14, true, '2025-10-28 20:15:45.756446+00'),
('8accb380-d4e1-4421-b37f-f71e726e598b', 'Романски', 'Romanian', 'Romanian', 15, true, '2025-10-28 20:15:45.756446+00'),
('6fe25554-515d-45d6-a9cb-89c73697c277', 'Полски', 'Polish', 'Polish', 16, true, '2025-10-28 20:15:45.756446+00'),
('c1aa97e2-0777-49e7-be05-90adabfb831e', 'Отомански', 'Ottoman', 'Ottoman', 17, true, '2025-10-28 20:15:45.756446+00'),
('fe6cd712-9381-42df-a3e5-a13dec2a0ce6', 'Османотурски', 'Ottoman Turkish', 'Ottoman Turkish', 18, true, '2025-10-28 20:15:45.756446+00'),
('e8f50d73-771a-4cec-9efa-2358a122c4ae', 'Хрватски', 'Croatian', 'Croatian', 19, true, '2025-10-28 20:15:45.756446+00'),
('e8551ede-b441-4b65-a0f0-828b855715b3', 'Латински', 'Latin', 'Latin', 20, true, '2025-10-28 20:15:45.756446+00'),
('cd3270f9-da94-4bc5-84eb-b447b50eb4e2', 'Коине', 'Koine', 'Koine', 21, true, '2025-10-28 20:15:45.756446+00'),
('e94d06b5-6c89-4165-99d0-0209bb018dc4', 'Италијански', 'Italian', 'Italian', 22, true, '2025-10-28 20:15:45.756446+00'),
('4e0f57e5-bf2a-4d91-b163-8437e715671c', 'Шпански', 'Spanish', '10', 23, true, '2025-10-23 20:23:30.398216+00')
ON CONFLICT (id) DO UPDATE SET
  name_mk = EXCLUDED.name_mk,
  name_en = EXCLUDED.name_en,
  value = EXCLUDED.value,
  sort_order = EXCLUDED.sort_order,
  is_active = EXCLUDED.is_active;
