
## Fix: Primary Image Not Updating When Editing Image Items

### Problem Identified

When you edit an image/testimonial and try to change the primary picture, it doesn't work because:

1. **During initial upload**: Both `thumbnail_url` (library grid) and `image_url` (detail page primary photo) are set to the same uploaded image
2. **During editing**: Only `thumbnail_url` gets updated - `image_url` is never touched
3. **On the detail page**: The primary photo comes from `image_url`, which still has the old image

This is why changing "Тековна сликичка" only affects the library view but not the detail page.

### Solution

Redesign the image editing interface to clearly distinguish between:
- **Primary Image**: The main photo shown on the item detail page
- **Additional Images**: Gallery images for the testimonial

### Changes to Make

**File: `src/components/AdminLibraryManager.tsx`**

1. **Add new state for primary image replacement**:
   ```typescript
   const [newPrimaryImage, setNewPrimaryImage] = useState<File | null>(null);
   ```

2. **Update the edit form UI** (for image type items):
   - Show the current primary image with a preview
   - Add a clear "Change Primary Image" upload option
   - Remove the confusing "Нова сликичка" field for image types (or repurpose it)

3. **Update the `handleSaveEdit` function**:
   - When a new primary image is uploaded, update BOTH `thumbnail_url` AND `image_url` for image-type items
   - This ensures consistency between the library grid and detail page

4. **Improve the UI/UX**:
   - Show a thumbnail preview of the current primary image
   - Add hover effect with "Change" button overlay
   - Show visual feedback when a new image is selected

### Technical Implementation

#### New State Variable (around line 72)
```typescript
const [newPrimaryImage, setNewPrimaryImage] = useState<File | null>(null);
```

#### Updated Save Logic (handleSaveEdit function)
For image-type items, when `newPrimaryImage` is set:
- Upload the new image
- Update both `thumbnail_url` and `image_url` to the new image URL

```typescript
// For image types, update both thumbnail and image_url
if (editingItem.type === 'image') {
  if (newPrimaryImage) {
    // Upload and set both thumbnail_url and image_url
    updateData.thumbnail_url = newImageUrl;
    updateData.image_url = newImageUrl;
  }
}
```

#### New UI Section (replacing current thumbnail section for images)
```tsx
{editingItem?.type === 'image' && (
  <div className="space-y-4">
    <Label>{t('Примарна Слика', 'Primary Image')}</Label>
    <div className="flex items-start gap-4">
      {/* Current image preview */}
      <div className="relative group">
        <img 
          src={newPrimaryImage ? URL.createObjectURL(newPrimaryImage) : editingItem?.imageUrl || editingItem?.thumbnail}
          alt="Primary"
          className="w-32 h-32 object-cover rounded-lg border"
        />
        <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-lg">
          <span className="text-white text-sm font-medium">
            {t('Промени', 'Change')}
          </span>
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => setNewPrimaryImage(e.target.files?.[0] || null)}
          />
        </label>
      </div>
      <p className="text-sm text-muted-foreground">
        {t('Оваа слика се прикажува како главна на страницата за детали', 
           'This image is displayed as the main image on the detail page')}
      </p>
    </div>
  </div>
)}
```

### Summary of Changes

| Current Behavior | New Behavior |
|------------------|--------------|
| "Нова сликичка" only updates `thumbnail_url` | "Primary Image" updates both `thumbnail_url` AND `image_url` |
| No preview of current primary image | Shows clickable preview with hover effect |
| Confusing terminology | Clear distinction: "Primary Image" vs "Additional Images" |

### Files to Modify

1. **`src/components/AdminLibraryManager.tsx`**:
   - Add `newPrimaryImage` state
   - Update `handleSaveEdit` to update `image_url` for image types
   - Replace the thumbnail upload section with a nicer image picker UI for image-type items
   - Reset `newPrimaryImage` when closing the dialog
