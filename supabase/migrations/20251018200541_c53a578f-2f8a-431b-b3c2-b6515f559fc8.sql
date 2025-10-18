-- Drop existing policy
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- Create new policy that explicitly requires authentication and restricts to own profile
CREATE POLICY "Authenticated users can view own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = id);

-- Explicitly deny public/anonymous access to profiles
CREATE POLICY "Deny public access to profiles"
ON public.profiles
FOR SELECT
TO anon
USING (false);