-- Create library_newspapers table for managing periodical newspaper names
CREATE TABLE public.library_newspapers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_mk TEXT NOT NULL,
  name_en TEXT NOT NULL,
  value TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.library_newspapers ENABLE ROW LEVEL SECURITY;

-- Create policies for public viewing of active newspapers
CREATE POLICY "Public can view active newspapers" 
ON public.library_newspapers 
FOR SELECT 
USING (is_active = true);

-- Create policies for admins to manage newspapers
CREATE POLICY "Admins can view all newspapers" 
ON public.library_newspapers 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert newspapers" 
ON public.library_newspapers 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update newspapers" 
ON public.library_newspapers 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete newspapers" 
ON public.library_newspapers 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));