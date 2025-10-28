-- Create library_languages table
CREATE TABLE public.library_languages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_mk TEXT NOT NULL,
  name_en TEXT NOT NULL,
  value TEXT UNIQUE NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create library_categories table
CREATE TABLE public.library_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_mk TEXT NOT NULL,
  name_en TEXT NOT NULL,
  value TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('book', 'image')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(value, type)
);

-- Enable RLS
ALTER TABLE public.library_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for library_languages
CREATE POLICY "Public can view active languages"
  ON public.library_languages
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can view all languages"
  ON public.library_languages
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert languages"
  ON public.library_languages
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update languages"
  ON public.library_languages
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete languages"
  ON public.library_languages
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for library_categories
CREATE POLICY "Public can view active categories"
  ON public.library_categories
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can view all categories"
  ON public.library_categories
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert categories"
  ON public.library_categories
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update categories"
  ON public.library_categories
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete categories"
  ON public.library_categories
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Seed languages
INSERT INTO public.library_languages (name_mk, name_en, value, sort_order) VALUES
  ('Македонски', 'Macedonian', 'Macedonian', 1),
  ('Англиски', 'English', 'English', 2),
  ('Германски', 'German', 'German', 3),
  ('Француски', 'French', 'French', 4),
  ('Руски', 'Russian', 'Russian', 5),
  ('Српски', 'Serbian', 'Serbian', 6),
  ('Бугарски', 'Bulgarian', 'Bulgarian', 7),
  ('Грчки', 'Greek', 'Greek', 8),
  ('Турски', 'Turkish', 'Turkish', 9),
  ('Албански', 'Albanian', 'Albanian', 10),
  ('Црковнословенски', 'Church Slavonic', 'Church Slavonic', 11),
  ('Старословенски', 'Old Church Slavonic', 'Old Church Slavonic', 12),
  ('Глаголица', 'Glagolitic Script', 'Glagolitic Script', 13),
  ('Словенски', 'Slovenian', 'Slovenian', 14),
  ('Романски', 'Romanian', 'Romanian', 15),
  ('Полски', 'Polish', 'Polish', 16),
  ('Отомански', 'Ottoman', 'Ottoman', 17),
  ('Османотурски', 'Ottoman Turkish', 'Ottoman Turkish', 18),
  ('Хрватски', 'Croatian', 'Croatian', 19),
  ('Латински', 'Latin', 'Latin', 20),
  ('Коине', 'Koine', 'Koine', 21),
  ('Италијански', 'Italian', 'Italian', 22);

-- Seed book categories
INSERT INTO public.library_categories (name_mk, name_en, value, type, sort_order) VALUES
  ('Историја', 'History', 'History', 'book', 1),
  ('Археологија', 'Archaeology', 'Archaeology', 'book', 2),
  ('Литература', 'Literature', 'Literature', 'book', 3),
  ('Етнологија', 'Ethnology', 'Ethnology', 'book', 4),
  ('Фолклор', 'Folklore', 'Folklore', 'book', 5);

-- Seed image/testimonial categories
INSERT INTO public.library_categories (name_mk, name_en, value, type, sort_order) VALUES
  ('Весник', 'Newspaper', 'Newspaper', 'image', 1),
  ('Документ', 'Document', 'Document', 'image', 2),
  ('Мапа', 'Map', 'Map', 'image', 3),
  ('Артефакт', 'Artefact', 'Artefact', 'image', 4),
  ('Ракопис', 'Manuscript', 'Manuscript', 'image', 5),
  ('Книга', 'Book', 'Book', 'image', 6),
  ('Фотографија', 'Photo', 'Photo', 'image', 7);