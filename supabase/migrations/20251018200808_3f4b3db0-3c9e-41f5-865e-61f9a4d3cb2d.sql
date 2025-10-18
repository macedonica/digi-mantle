-- Secure the public_library_items view with proper permissions
-- Views don't use RLS policies like tables, but we control access via GRANT statements

-- First, revoke all existing permissions on the view
REVOKE ALL ON public.public_library_items FROM anon, authenticated, public;

-- Grant SELECT permission only to anon and authenticated users
-- This allows public read access while preventing any modifications
GRANT SELECT ON public.public_library_items TO anon, authenticated;

-- Add a comment explaining the security model
COMMENT ON VIEW public.public_library_items IS 'Public read-only view of library items. SELECT only - no INSERT/UPDATE/DELETE allowed. Modifications must be done by admins on the library_items table.';
