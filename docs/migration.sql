-- ============================================
-- COMPLETE MIGRATION SCRIPT FOR SELF-HOSTING
-- ============================================
-- Run this in your Supabase SQL Editor

-- ============================================
-- 1. CREATE ENUM TYPES
-- ============================================
CREATE TYPE public.app_role AS ENUM ('admin');

-- ============================================
-- 2. CREATE TABLES
-- ============================================

-- Profiles table
CREATE TABLE public.profiles (
    id UUID NOT NULL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    email TEXT NOT NULL,
    full_name TEXT
);

-- User roles table
CREATE TABLE public.user_roles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    role public.app_role NOT NULL DEFAULT 'admin'::app_role,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Library languages table
CREATE TABLE public.library_languages (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    name_mk TEXT NOT NULL,
    name_en TEXT NOT NULL,
    value TEXT NOT NULL
);

-- Library categories table
CREATE TABLE public.library_categories (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    name_mk TEXT NOT NULL,
    name_en TEXT NOT NULL,
    value TEXT NOT NULL,
    type TEXT NOT NULL
);

-- Library newspapers table
CREATE TABLE public.library_newspapers (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    value TEXT NOT NULL,
    name_mk TEXT NOT NULL,
    name_en TEXT NOT NULL
);

-- Library items table
CREATE TABLE public.library_items (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    uploaded_by UUID,
    type TEXT NOT NULL,
    title_mk TEXT NOT NULL,
    title_en TEXT NOT NULL,
    author TEXT NOT NULL,
    author_en TEXT,
    year TEXT,
    year_mk TEXT,
    year_en TEXT,
    language TEXT[] NOT NULL DEFAULT '{}'::text[],
    category TEXT[] NOT NULL DEFAULT '{}'::text[],
    keywords TEXT[] DEFAULT '{}'::text[],
    description_mk TEXT,
    description_en TEXT,
    thumbnail_url TEXT NOT NULL,
    pdf_url TEXT,
    image_url TEXT,
    additional_images TEXT[] DEFAULT '{}'::text[],
    publication_city TEXT,
    publication_city_en TEXT,
    publisher TEXT,
    publisher_en TEXT,
    type_mk TEXT,
    type_en TEXT,
    source_mk TEXT,
    source_en TEXT,
    issue_number_mk TEXT,
    issue_number_en TEXT,
    watermark_url TEXT,
    watermark_link TEXT
);

-- ============================================
-- 3. CREATE VIEW
-- ============================================
CREATE OR REPLACE VIEW public.public_library_items
WITH (security_invoker = true)
AS
SELECT 
    id,
    created_at,
    updated_at,
    keywords,
    category,
    description_mk,
    description_en,
    thumbnail_url,
    pdf_url,
    image_url,
    additional_images,
    publication_city,
    publication_city_en,
    publisher,
    publisher_en,
    issue_number_mk,
    issue_number_en,
    watermark_url,
    watermark_link,
    type,
    title_mk,
    title_en,
    author,
    author_en,
    year,
    year_mk,
    year_en,
    type_mk,
    type_en,
    source_mk,
    source_en,
    language
FROM public.library_items;

-- ============================================
-- 4. CREATE SECURITY DEFINER FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- ============================================
-- 5. CREATE TRIGGER FUNCTION FOR NEW USERS
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', '')
  );
  
  -- Every new user is automatically an admin (change for production!)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'admin');
  
  RETURN new;
END;
$$;

-- ============================================
-- 6. CREATE TRIGGER
-- ============================================
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 7. ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_newspapers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_items ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 8. RLS POLICIES - PROFILES
-- ============================================
CREATE POLICY "Authenticated users can view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Deny public access to profiles"
ON public.profiles FOR SELECT
USING (false);

-- ============================================
-- 9. RLS POLICIES - USER ROLES
-- ============================================
CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- ============================================
-- 10. RLS POLICIES - LIBRARY LANGUAGES
-- ============================================
CREATE POLICY "Public can view active languages"
ON public.library_languages FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can view all languages"
ON public.library_languages FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert languages"
ON public.library_languages FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update languages"
ON public.library_languages FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete languages"
ON public.library_languages FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- ============================================
-- 11. RLS POLICIES - LIBRARY CATEGORIES
-- ============================================
CREATE POLICY "Public can view active categories"
ON public.library_categories FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can view all categories"
ON public.library_categories FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert categories"
ON public.library_categories FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update categories"
ON public.library_categories FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete categories"
ON public.library_categories FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- ============================================
-- 12. RLS POLICIES - LIBRARY NEWSPAPERS
-- ============================================
CREATE POLICY "Public can view active newspapers"
ON public.library_newspapers FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can view all newspapers"
ON public.library_newspapers FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert newspapers"
ON public.library_newspapers FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update newspapers"
ON public.library_newspapers FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete newspapers"
ON public.library_newspapers FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- ============================================
-- 13. RLS POLICIES - LIBRARY ITEMS
-- ============================================
CREATE POLICY "Allow public read access to library items"
ON public.library_items FOR SELECT
USING (true);

CREATE POLICY "Only admins can view library items table directly"
ON public.library_items FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert library items"
ON public.library_items FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update library items"
ON public.library_items FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete library items"
ON public.library_items FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- ============================================
-- 14. CREATE STORAGE BUCKETS
-- ============================================
INSERT INTO storage.buckets (id, name, public) VALUES ('library-images', 'library-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('library-pdfs', 'library-pdfs', false);

-- ============================================
-- MIGRATION COMPLETE!
-- ============================================
-- Next steps:
-- 1. Set up storage policies (see SELF_HOSTING_GUIDE.md)
-- 2. Configure authentication settings
-- 3. Update your .env file with new credentials
