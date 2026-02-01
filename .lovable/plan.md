

## Smart File Uploader Component

A new reusable component for the admin panel that automatically routes file uploads based on size - small files go to the database storage, while large files (over 50MB) are sent to your custom archive server.

### How It Works

```text
+-------------------+     +------------------+
|   File Selected   | --> | Check File Size  |
+-------------------+     +------------------+
                                   |
                    +--------------+--------------+
                    |                             |
              < 50MB                          >= 50MB
                    |                             |
                    v                             v
        +-------------------+         +-------------------+
        | Upload to Cloud   |         | Archive to Server |
        | (Supabase Storage)|         | (PHP Endpoint)    |
        +-------------------+         +-------------------+
                    |                             |
                    +--------------+--------------+
                                   |
                                   v
                        +-------------------+
                        | Save URL to       |
                        | library_items     |
                        +-------------------+
```

### Visual Experience

| Scenario | Badge Displayed | Progress |
|----------|-----------------|----------|
| File < 50MB | "Uploading to Cloud..." (blue) | Real-time % |
| File >= 50MB | "Archiving to Cold Storage (Large File)..." (amber) | Real-time % |
| Success | Green checkmark toast | 100% |
| Error | Red error toast | Stopped |

---

## Implementation Steps

### Step 1: Create the SmartFileUploader Component

**New File:** `src/components/SmartFileUploader.tsx`

This component will include:

- **Dropzone UI** - Drag-and-drop area with click-to-browse
- **Size Detection Logic** - Check if file >= 50MB (50 * 1024 * 1024 bytes)
- **Dual Upload Paths:**
  - **Small files:** Use Supabase SDK to upload to `library-pdfs` bucket
  - **Large files:** Use XMLHttpRequest to POST to `https://bibliothecamacedonica.com/upload_handler.php` with:
    - FormData containing the file
    - Header: `X-API-KEY: yba33y5NYiI72ZLV`
- **Progress Tracking** - Real-time progress bar using XMLHttpRequest's `onprogress` event
- **Status Badges** - Dynamic badge showing current routing destination
- **Toast Notifications** - Success/error feedback

### Step 2: Add to Admin Dashboard

**Modify:** `src/pages/AdminDashboard.tsx`

Add a new tab "Large Files" alongside existing Upload/Manage/Options tabs:

```text
[ Upload ] [ Manage ] [ Options ] [ Large Files ]
```

This tab will house the SmartFileUploader component for handling oversized periodicals and books.

### Step 3: Optional Integration Points

The component can also be:
- Integrated into the existing `UploadForm.tsx` for PDFs
- Used in `AdminLibraryManager.tsx` when editing items

---

## Technical Details

### File Size Threshold
```typescript
const SIZE_THRESHOLD = 50 * 1024 * 1024; // 50MB in bytes
const isLargeFile = file.size >= SIZE_THRESHOLD;
```

### Large File Upload (PHP Server)
```typescript
const uploadToArchive = async (file: File, onProgress: (percent: number) => void) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('file', file);
    
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };
    
    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        resolve(response.url); // Expects { url: "https://..." }
      } else {
        reject(new Error('Upload failed'));
      }
    };
    
    xhr.open('POST', 'https://bibliothecamacedonica.com/upload_handler.php');
    xhr.setRequestHeader('X-API-KEY', 'yba33y5NYiI72ZLV');
    xhr.send(formData);
  });
};
```

### Small File Upload (Cloud Storage)
```typescript
const uploadToSupabase = async (file: File) => {
  const path = `${crypto.randomUUID()}-${file.name}`;
  const { error } = await supabase.storage
    .from('library-pdfs')
    .upload(path, file);
  
  if (error) throw error;
  
  const { data: { publicUrl } } = supabase.storage
    .from('library-pdfs')
    .getPublicUrl(path);
  
  return publicUrl;
};
```

---

## PHP Server Requirement

You will need to create `upload_handler.php` on your cPanel server that:

1. Validates the `X-API-KEY` header matches `yba33y5NYiI72ZLV`
2. Accepts multipart form uploads
3. Saves files to a public directory
4. Returns JSON with the public URL: `{"url": "https://bibliothecamacedonica.com/uploads/filename.pdf"}`

Example PHP structure (you'll need to create this on your server):

```php
<?php
// upload_handler.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: X-API-KEY, Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$apiKey = $_SERVER['HTTP_X_API_KEY'] ?? '';
if ($apiKey !== 'yba33y5NYiI72ZLV') {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

if (!isset($_FILES['file'])) {
    http_response_code(400);
    echo json_encode(['error' => 'No file uploaded']);
    exit;
}

$uploadDir = 'uploads/';
$fileName = uniqid() . '-' . basename($_FILES['file']['name']);
$targetPath = $uploadDir . $fileName;

if (move_uploaded_file($_FILES['file']['tmp_name'], $targetPath)) {
    $publicUrl = 'https://bibliothecamacedonica.com/' . $targetPath;
    echo json_encode(['url' => $publicUrl]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Upload failed']);
}
?>
```

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/components/SmartFileUploader.tsx` | Create new component |
| `src/pages/AdminDashboard.tsx` | Add new "Large Files" tab |

---

## Security Considerations

- The API key (`yba33y5NYiI72ZLV`) will be visible in client-side code
- For production, consider:
  - Rate limiting on the PHP endpoint
  - File type validation on server side
  - Maximum file size limit on server (set in php.ini)

