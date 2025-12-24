# Data Migration Guide

## Migration from Lovable Cloud to Your Own Supabase

This guide exports all 85 library items and configuration data from the old Lovable Cloud database to your new Supabase project.

---

## Step 1: Download the Library Items Export

Visit this URL to download the SQL export of all library items:

**[Download Library Items SQL](https://kkvjdxxrhvcmfavbreso.supabase.co/functions/v1/export-data)**

Save this file as `data_export_items.sql`

---

## Step 2: Download Files from Old Storage

Go to the old Supabase project storage:
- **Old Project Storage**: `https://supabase.com/dashboard/project/kkvjdxxrhvcmfavbreso/storage/buckets`

Download ALL files from:
1. **library-images** bucket (contains thumbnails and images)
2. **library-pdfs** bucket (contains PDF documents)

---

## Step 3: Create Storage Buckets in New Project

In your new Supabase project (`vmlrlopprqgakooqanbu`):
1. Go to **Storage** in dashboard
2. Create bucket: `library-images` (set as **Public**)
3. Create bucket: `library-pdfs` (set as **Private**)

Then run the storage policies from `docs/SELF_HOSTING_GUIDE.md`

---

## Step 4: Upload Files to New Storage

Upload all downloaded files to the corresponding buckets in your new project, **keeping the same file names**.

---

## Step 5: Import Database Data

Run these SQL scripts **in order** in your new Supabase SQL Editor:

1. **First**: Run `docs/migration.sql` (creates tables and functions)
2. **Then**: Run `docs/data_export_categories.sql`
3. **Then**: Run `docs/data_export_languages.sql`
4. **Then**: Run `docs/data_export_newspapers.sql`
5. **Then**: Run the downloaded `data_export_items.sql`
6. **Finally**: Run `docs/update_urls.sql` (updates file URLs to new project)

---

## Step 6: Create Admin User

1. Sign up on your deployed site
2. Run this SQL to make yourself admin:

```sql
UPDATE public.user_roles 
SET role = 'admin' 
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'your-email@example.com'
);
```

---

## Files in this Export

| File | Description |
|------|-------------|
| `docs/migration.sql` | Full database schema (tables, RLS, functions) |
| `docs/data_export_categories.sql` | 12 library categories |
| `docs/data_export_languages.sql` | 23 languages |
| `docs/data_export_newspapers.sql` | 3 newspapers |
| `data_export_items.sql` | 85 library items (download from edge function) |
| `docs/update_urls.sql` | Updates storage URLs after file migration |

---

## Troubleshooting

### "Permission denied" when running SQL
Make sure you're running the migration.sql first to create the `has_role` function.

### Files not displaying
- Verify `library-images` bucket is set to **Public**
- Check that file names match exactly (including UUID prefixes)

### Storage upload errors
Run the storage policies SQL from `docs/SELF_HOSTING_GUIDE.md`
