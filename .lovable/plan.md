

## Integrate Smart File Routing into Book/Periodical Upload

### Current Problem

The SmartFileUploader was created as a **separate standalone component** in its own tab. It can upload files and get URLs, but it doesn't connect to the book/periodical creation workflow.

What you actually need is for the **existing UploadForm** to automatically route PDFs based on size when creating a book or periodical.

---

### Proposed Solution

Modify the `UploadForm.tsx` to include the smart routing logic directly in the PDF upload section:

```text
User uploads a book/periodical
         │
         ▼
Fill in metadata (title, author, year, etc.)
         │
         ▼
Attach PDF file
         │
         ├─── < 50MB ───► Upload to Supabase Storage (library-pdfs bucket)
         │
         └─── >= 50MB ──► Upload to PHP Archive Server
                          (https://bibliothecamacedonica.com/upload_handler.php)
         │
         ▼
Get public URL (from either source)
         │
         ▼
Save to library_items table with pdf_url
```

---

### Technical Changes

**File:** `src/components/UploadForm.tsx`

1. **Add Size Threshold Constant**
   ```typescript
   const SIZE_THRESHOLD = 50 * 1024 * 1024; // 50MB
   const ARCHIVE_ENDPOINT = 'https://bibliothecamacedonica.com/upload_handler.php';
   const ARCHIVE_API_KEY = 'yba33y5NYiI72ZLV';
   ```

2. **Add Upload Progress State**
   - Track upload progress for large files
   - Show dynamic badge indicating upload destination

3. **Create `uploadPdfFile` Helper Function**
   ```typescript
   const uploadPdfFile = async (file: File): Promise<string> => {
     if (file.size >= SIZE_THRESHOLD) {
       // Large file → PHP archive server with XHR for progress
       return uploadToArchive(file);
     } else {
       // Small file → Supabase storage
       return uploadToSupabase(file);
     }
   };
   ```

4. **Modify `handleSubmit` Function**
   - Replace the direct Supabase upload logic (lines 190-203) with the smart routing function
   - The returned URL (from either Supabase or PHP) gets saved to `pdf_url` in `library_items`

5. **UI Enhancements**
   - Show upload progress bar when uploading large PDFs
   - Display badge: "Uploading to Cloud..." or "Archiving to Cold Storage..."
   - Show file size indicator with warning for large files

---

### What Happens to SmartFileUploader?

Two options:

**Option A - Keep It (Recommended)**  
Keep the "Large Files" tab for uploading files that aren't attached to any library item (just raw file storage). It remains useful as a standalone file uploader.

**Option B - Remove It**  
Remove the "Large Files" tab entirely since all file uploads will now go through the integrated UploadForm.

---

### Files to Modify

| File | Changes |
|------|---------|
| `src/components/UploadForm.tsx` | Add smart routing logic, progress bar, status badges |
| `src/pages/AdminDashboard.tsx` | Optionally remove "Large Files" tab if no longer needed |

---

### Visual Changes to Upload Form

When uploading a book/periodical with a PDF:

| Scenario | What User Sees |
|----------|----------------|
| PDF < 50MB | Normal upload, no special indicator |
| PDF >= 50MB | Warning badge + progress bar + "Archiving to Cold Storage..." message |
| Upload success | Green toast with destination info |

---

### Reminder: PHP Server Setup Required

Your cPanel server still needs the `upload_handler.php` file that:
1. Validates the `X-API-KEY` header
2. Saves uploaded files
3. Returns JSON: `{"url": "https://bibliothecamacedonica.com/uploads/filename.pdf"}`

