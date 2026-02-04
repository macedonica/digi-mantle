

## Cache Warmer System Implementation

### Overview
This plan implements a cache warming system that automatically triggers a background request to locally-stored PDF files when you save a book/periodical, forcing Cloudflare to cache the file before real users access it.

### How It Works

```text
┌─────────────────────────────────────────────────────────────────┐
│  Admin saves book with "Local Storage File" option              │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│  1. Save to database (Supabase)                                 │
│  2. Show success toast                                          │
│  3. Fire-and-forget request to warm_cache.php                   │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│  warm_cache.php (on your cPanel server)                         │
│  - Receives filename parameter                                  │
│  - Uses cURL to request the PDF from public URL                 │
│  - 5-second timeout (just triggers download start)              │
│  - Cloudflare caches the response                               │
└─────────────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│  First real user gets instant cached response!                  │
└─────────────────────────────────────────────────────────────────┘
```

---

### Part 1: PHP Script (warm_cache.php)

**File Location:** Upload to `public_html/warm_cache.php`

**Functionality:**
- Accepts `file` parameter (e.g., `?file=book_name.pdf`)
- Constructs full URL: `https://bibliothecamacedonica.com/library_storage/{filename}`
- Uses cURL to fetch the file through the public URL (via Cloudflare)
- Sets 5-second timeout so it doesn't hang
- Returns JSON response indicating success/failure
- Includes basic security: CORS headers for your domain, input sanitization

**PHP Code Features:**
- Input sanitization (removes path traversal attempts like `../`)
- Only allows `.pdf` extension for safety
- CORS headers allowing requests from your domain
- JSON response for easy debugging
- Error handling for cURL failures

---

### Part 2: React Frontend Changes

#### 2.1 Helper Function for Cache Warming

Create a utility function that:
- Accepts a filename
- Makes a fire-and-forget fetch request to the PHP endpoint
- Logs success/failure to console (doesn't block the user)
- Uses `mode: 'no-cors'` as fallback if CORS issues occur

#### 2.2 UploadForm.tsx Changes

**Location:** After successful database insert (line ~310-317)

**Logic:**
```
IF bookContentType === 'local' AND localFilename has value:
  - Fire cache warming request
  - Show enhanced toast: "Book Saved & Cache Warming Started"
ELSE:
  - Show normal success toast
```

#### 2.3 AdminLibraryManager.tsx Changes  

**Location:** After successful database update (line ~445-448)

**Logic:**
```
IF pdfSourceType === 'local' AND localFilename has value:
  - Fire cache warming request
  - Show enhanced toast: "Item Updated & Cache Warming Started"
ELSE:
  - Show normal success toast
```

---

### Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `docs/warm_cache.php` | Create | PHP script for cache warming (you upload to cPanel) |
| `src/lib/cacheWarmer.ts` | Create | Utility function for triggering cache warm |
| `src/components/UploadForm.tsx` | Modify | Add cache warming after new book save |
| `src/components/AdminLibraryManager.tsx` | Modify | Add cache warming after book edit |

---

### Technical Details

#### PHP Script Configuration
| Variable | Value | Description |
|----------|-------|-------------|
| `$base_url` | `https://bibliothecamacedonica.com/library_storage` | Your library storage folder |
| `$timeout` | 5 | Seconds before cURL gives up (just need to trigger download) |
| `$allowed_extensions` | `['pdf']` | Only allow PDF files for security |

#### Frontend Configuration
| Variable | Value | Description |
|----------|-------|-------------|
| `CACHE_WARMER_URL` | `https://bibliothecamacedonica.com/warm_cache.php` | PHP endpoint |

---

### Deployment Steps

1. **After I implement the changes:**
   - Copy the contents of `docs/warm_cache.php`
   - Upload to `public_html/warm_cache.php` on your cPanel
   - Make sure the file has read/execute permissions (644 or 755)

2. **Test the PHP script directly:**
   - Visit: `https://bibliothecamacedonica.com/warm_cache.php?file=test.pdf`
   - Should return JSON response (even if file doesn't exist, it should show error)

3. **Test the full flow:**
   - Create or edit a book with "Local Storage File" option
   - Enter a valid filename
   - Save and verify the toast shows "Cache Warming Started"
   - Check browser console for confirmation

---

### Summary of Changes

**New Files:**
- `docs/warm_cache.php` - PHP script (copy to cPanel)
- `src/lib/cacheWarmer.ts` - Utility function

**Modified Files:**
- `src/components/UploadForm.tsx` - Add cache warming after save
- `src/components/AdminLibraryManager.tsx` - Add cache warming after edit

**No database changes required.**

