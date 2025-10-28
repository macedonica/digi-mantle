-- Create a policy that allows anyone (including unauthenticated users) to read library items
-- This will work through the public_library_items view which excludes sensitive fields
CREATE POLICY "Allow public read access to library items"
ON public.library_items
FOR SELECT
TO anon, authenticated
USING (true);