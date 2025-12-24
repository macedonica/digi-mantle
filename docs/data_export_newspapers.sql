-- ============================================
-- LIBRARY NEWSPAPERS DATA EXPORT
-- Run this in your new Supabase SQL Editor
-- ============================================

-- Clear existing data (optional - remove if you want to keep existing)
-- DELETE FROM library_newspapers;

INSERT INTO library_newspapers (id, name_mk, name_en, value, sort_order, is_active, created_at) VALUES
('0511bb5a-93e3-4b9f-91ac-55f0b373be73', 'Утрински Весник', 'Utrinski Vesnik', 'utrinski', 1, true, '2025-11-04 19:48:30.155537+00'),
('dcc5b60a-1820-463e-99d7-3d6285706190', 'Вардарски Глас', 'Vardarski Glas', 'VarGla', 2, true, '2025-11-04 20:44:02.865335+00'),
('c912c232-54a6-4e4d-bbee-720852ec57cf', 'Македонско сонце', 'Macedonian sun', 'MacSun', 3, true, '2025-12-06 10:47:41.097155+00')
ON CONFLICT (id) DO UPDATE SET
  name_mk = EXCLUDED.name_mk,
  name_en = EXCLUDED.name_en,
  value = EXCLUDED.value,
  sort_order = EXCLUDED.sort_order,
  is_active = EXCLUDED.is_active;
