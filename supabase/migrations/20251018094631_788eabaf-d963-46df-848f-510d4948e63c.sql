-- Create profiles table for admin users
CREATE TABLE public.profiles (
  id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS: Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Create role enum (only admin role needed)
CREATE TYPE public.app_role AS ENUM ('admin');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'admin',
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (BEFORE using it in policies)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- NOW create RLS policies that use the function
CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger function to auto-create profile and assign admin role
CREATE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', '')
  );
  
  -- Every new user is automatically an admin
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'admin');
  
  RETURN new;
END;
$$;

-- Create trigger for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create library_items table
CREATE TABLE public.library_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('book', 'image')),
  title_mk text NOT NULL,
  title_en text NOT NULL,
  author text NOT NULL,
  year integer NOT NULL,
  language text NOT NULL,
  category text NOT NULL,
  keywords text[] DEFAULT '{}',
  description_mk text,
  description_en text,
  thumbnail_url text NOT NULL,
  pdf_url text,
  image_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  uploaded_by uuid REFERENCES auth.users(id)
);

ALTER TABLE public.library_items ENABLE ROW LEVEL SECURITY;

-- RLS: Everyone (including anonymous) can view library items
CREATE POLICY "Anyone can view library items"
  ON public.library_items FOR SELECT
  USING (true);

-- RLS: Only admins can insert/update/delete
CREATE POLICY "Admins can insert library items"
  ON public.library_items FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update library items"
  ON public.library_items FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete library items"
  ON public.library_items FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('library-pdfs', 'library-pdfs', true);

INSERT INTO storage.buckets (id, name, public)
VALUES ('library-images', 'library-images', true);

-- Storage RLS: Public can view PDFs
CREATE POLICY "Public can view PDFs"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'library-pdfs');

-- Storage RLS: Admins can upload PDFs
CREATE POLICY "Admins can upload PDFs"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'library-pdfs' AND
    (SELECT public.has_role(auth.uid(), 'admin'))
  );

-- Storage RLS: Admins can delete PDFs
CREATE POLICY "Admins can delete PDFs"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'library-pdfs' AND
    (SELECT public.has_role(auth.uid(), 'admin'))
  );

-- Storage RLS: Public can view images
CREATE POLICY "Public can view images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'library-images');

-- Storage RLS: Admins can upload images
CREATE POLICY "Admins can upload images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'library-images' AND
    (SELECT public.has_role(auth.uid(), 'admin'))
  );

-- Storage RLS: Admins can delete images
CREATE POLICY "Admins can delete images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'library-images' AND
    (SELECT public.has_role(auth.uid(), 'admin'))
  );