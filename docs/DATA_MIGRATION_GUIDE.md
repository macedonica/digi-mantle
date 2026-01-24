# Data Migration Guide

**STATUS: COMPLETED - FOR REFERENCE ONLY**

This guide documents the data migration process from the original environment to the self-hosted Supabase project. Keep this for historical reference.

---

## Migration Steps (Completed)

### Step 1: Export Library Items
Library items data was exported from the original database.

### Step 2: Download Storage Files
All files from `library-images` and `library-pdfs` buckets were downloaded.

### Step 3: Create Storage Buckets
In the new Supabase project:
- Created `library-images` bucket (Public)
- Created `library-pdfs` bucket (Private)

### Step 4: Upload Files
All files were uploaded to the new storage buckets maintaining original file names.

### Step 5: Import Database Data
SQL scripts were run in this order:
1. `docs/migration.sql` - Schema creation
2. `docs/data_export_categories.sql` - Categories data
3. `docs/data_export_languages.sql` - Languages data
4. `docs/data_export_newspapers.sql` - Newspapers data
5. Main library items data
6. `docs/update_urls.sql` - Update storage URLs

### Step 6: Create Admin User
Admin user was created and configured with proper roles.

---

## Reference: SQL Files

| File | Purpose |
|------|---------|
| `migration.sql` | Complete database schema |
| `data_export_categories.sql` | Library categories |
| `data_export_languages.sql` | Language options |
| `data_export_newspapers.sql` | Newspaper options |
| `update_urls.sql` | Update storage URLs |

---

## Troubleshooting Reference

### "Permission denied" errors
- Check RLS policies are applied
- Verify admin role is correctly assigned

### Files not displaying
- Verify files exist in storage buckets
- Check storage bucket policies
- For PDFs, ensure signed URLs are being generated

### Storage upload errors
- Check file size limits (default 50MB)
- Verify storage policies allow the operation
