# Self-Hosting Guide

This guide explains how to migrate from Lovable Cloud to your own Supabase project.

## Step 1: Create a New Supabase Project

1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Note your project URL and anon key from Settings → API

## Step 2: Run the Migration Script

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `docs/migration.sql`
3. Run the script

## Step 3: Create Storage Buckets

In Supabase dashboard, go to **Storage** and create:

1. **library-pdfs** bucket (Private)
   - Uncheck "Public bucket"
   
2. **library-images** bucket (Public)
   - Check "Public bucket"

Then run this SQL in the SQL Editor to set up storage policies:

```sql
-- Policies for library-images (public bucket)
CREATE POLICY "Public can view library images"
ON storage.objects FOR SELECT
USING (bucket_id = 'library-images');

CREATE POLICY "Admins can upload library images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'library-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update library images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'library-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete library images"
ON storage.objects FOR DELETE
USING (bucket_id = 'library-images' AND public.has_role(auth.uid(), 'admin'));

-- Policies for library-pdfs (private bucket)
CREATE POLICY "Public can view library pdfs"
ON storage.objects FOR SELECT
USING (bucket_id = 'library-pdfs');

CREATE POLICY "Admins can upload library pdfs"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'library-pdfs' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update library pdfs"
ON storage.objects FOR UPDATE
USING (bucket_id = 'library-pdfs' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete library pdfs"
ON storage.objects FOR DELETE
USING (bucket_id = 'library-pdfs' AND public.has_role(auth.uid(), 'admin'));
```

## Step 4: Configure Authentication

In Supabase dashboard, go to **Authentication → Settings**:

1. **Site URL**: Set to your deployed website URL
2. **Redirect URLs**: Add your website URL
3. **Email**: Disable "Confirm email" for easier testing (optional)

## Step 5: Update Environment Variables

Create a `.env` file in your project root:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key_here
VITE_SUPABASE_PROJECT_ID=YOUR_PROJECT_ID
```

## Step 6: Build and Deploy

### Option A: Vercel/Netlify
1. Push code to GitHub
2. Connect repo to Vercel/Netlify
3. Add environment variables in dashboard
4. Deploy

### Option B: Custom Server
```bash
npm install
npm run build
# Serve the 'dist' folder with any static file server
```

## Step 7: Create First Admin User

1. Sign up on your deployed site
2. In Supabase SQL Editor, run:

```sql
-- Replace with your user's email
UPDATE public.user_roles 
SET role = 'admin' 
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'your-email@example.com'
);
```

Note: The `handle_new_user` trigger automatically creates an admin role for new users. You may want to change this behavior for production.

## Troubleshooting

### "Row level security policy" errors
- Ensure you're logged in
- Check RLS policies are correctly applied

### Storage upload failures
- Verify storage buckets exist
- Check storage policies are applied

### Auth redirect issues
- Verify Site URL and Redirect URLs in Auth settings
