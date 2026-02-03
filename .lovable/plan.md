
## Add "Local Storage File" Option for PDF Content

### Overview
Add a third option when uploading/editing books and periodicals that allows you to reference PDF files that have been manually uploaded to your cPanel server at `public_html/library_storage/`. This bypasses Supabase storage limits entirely.

### How It Works

```text
+---------------------------+
|  Book Content Options     |
+---------------------------+
| ( ) Upload PDF            |  <-- Uses Supabase storage
| ( ) Provide Link          |  <-- External URL
| ( ) Local Storage File    |  <-- NEW! Your cPanel server
+---------------------------+
```

When you select "Local Storage File":
- Enter just the filename (e.g., `mybook.pdf`)
- The system constructs the full URL: `https://your-domain.com/library_storage/mybook.pdf`
- This URL is stored in `pdf_url` column
- When users click "Open PDF", it opens directly from your server

---

### Files to Modify

#### 1. UploadForm.tsx - New Upload Dialog

**Changes:**
- Add new state: `bookContentType` expanded from `'pdf' | 'link'` to `'pdf' | 'link' | 'local'`
- Add third radio option for "Local Storage File" (Локална датотека)
- Add text input for filename when "local" is selected
- Add state for local filename and base URL configuration
- On submit: construct full URL as `{baseStorageUrl}/library_storage/{filename}`

**New UI Section (around line 730-776):**
```tsx
<label className="flex items-center gap-2 cursor-pointer">
  <input
    type="radio"
    name="bookContentType"
    value="local"
    checked={bookContentType === 'local'}
    onChange={() => setBookContentType('local')}
  />
  <span>{t('Локална датотека', 'Local Storage File')}</span>
</label>

{bookContentType === 'local' && (
  <div className="space-y-2">
    <Label>{t('Име на датотека', 'Filename')}</Label>
    <Input
      placeholder="example.pdf"
      value={localFilename}
      onChange={(e) => setLocalFilename(e.target.value)}
    />
    <p className="text-sm text-muted-foreground">
      {t('Внесете го името на PDF-от што е качен во library_storage папката', 
         'Enter the filename of PDF uploaded to library_storage folder')}
    </p>
  </div>
)}
```

**Submit Logic Update:**
- If `bookContentType === 'local'` and `localFilename` is provided:
  - Construct: `pdfUrl = https://yourdomain.com/library_storage/${localFilename}`
  - Store this URL in database

---

#### 2. AdminLibraryManager.tsx - Edit Dialog

**Changes:**
- Add state for PDF source type: `'existing' | 'upload' | 'link' | 'local'`
- Detect current PDF type when opening edit dialog (is it Supabase URL, external link, or local storage?)
- Add radio options similar to UploadForm
- Add local filename input field

**New State Variables:**
```tsx
const [pdfSourceType, setPdfSourceType] = useState<'existing' | 'upload' | 'link' | 'local'>('existing');
const [localFilename, setLocalFilename] = useState('');
const [pdfLink, setPdfLink] = useState('');
```

**Edit Dialog UI (around lines 1113-1158):**
Add radio group to select PDF source:
- Keep existing PDF
- Upload new PDF  
- Enter external link
- Local storage file

---

#### 3. ItemDetail.tsx - PDF Display Logic

**Current behavior already supports this!**

The current code at lines 114-119 generates signed URLs only for Supabase storage. For external URLs (including your local storage URLs), the system will:
1. Store the URL in `pdf_url`
2. The signed URL generation will fail gracefully (no Supabase path)
3. The button logic already handles this - it checks for `signedPdfUrl` first, then falls back to source URL

**Minor adjustment needed:**
Update the PDF button logic to also check if `item.pdfUrl` is an external URL (not Supabase) and open it directly.

---

### Configuration

You'll need to set your base storage URL. Options:

**Option A: Hardcoded (Simplest)**
```tsx
const LOCAL_STORAGE_BASE = 'https://your-domain.com/library_storage';
```

**Option B: Environment Variable**
Add to `.env`:
```
VITE_LOCAL_STORAGE_URL=https://your-domain.com/library_storage
```

---

### Technical Details

#### State Changes in UploadForm.tsx
| State Variable | Type | Purpose |
|----------------|------|---------|
| `bookContentType` | `'pdf' \| 'link' \| 'local'` | Select content source |
| `localFilename` | `string` | Filename for local storage |

#### State Changes in AdminLibraryManager.tsx  
| State Variable | Type | Purpose |
|----------------|------|---------|
| `pdfSourceType` | `'existing' \| 'upload' \| 'link' \| 'local'` | Select how to handle PDF |
| `localFilename` | `string` | Filename for local storage |
| `pdfLink` | `string` | URL for external link option |

#### Database
No schema changes needed - `pdf_url` column already stores URLs as strings.

---

### User Workflow

**Uploading a new book with local file:**
1. Upload PDF via cPanel/FTP to `public_html/library_storage/mybook.pdf`
2. In admin, create new book
3. Select "Local Storage File" option
4. Enter filename: `mybook.pdf`
5. Save - system stores: `https://your-domain.com/library_storage/mybook.pdf`

**Editing existing book to use local file:**
1. Open book in admin edit dialog
2. Select "Local Storage File" radio
3. Enter the filename
4. Save

---

### Summary of Changes

| File | Changes |
|------|---------|
| `src/components/UploadForm.tsx` | Add 'local' option, filename input, URL construction |
| `src/components/AdminLibraryManager.tsx` | Add PDF source type selection, local filename input |
| `src/pages/ItemDetail.tsx` | Update PDF button to handle non-Supabase URLs |

This approach:
- Requires no database changes
- Works with your existing cPanel hosting
- No file size limits
- Simple filename-based referencing
