
## Clean Up: Hide Redundant "Нова сликичка" for Image Types

### Current Issue
For image/testimonial items, there are two ways to change the thumbnail:
1. **"Примарна Слика" section** (at top) - Updates both thumbnail and primary image 
2. **"Нова сликичка (опционално)"** (at bottom) - Only updates thumbnail

This is confusing and redundant for image types.

### Solution
Hide the "Нова сликичка (опционално)" field when editing **image type** items, since the "Примарна Слика" section handles this functionality better.

### File to Modify

**`src/components/AdminLibraryManager.tsx`** (around line 1090-1104)

Change the thumbnail upload section to only show for book/periodical types:

**Current code:**
```tsx
<div className="space-y-4 border-t pt-4">
  <div className="space-y-2">
    <Label htmlFor="edit_thumbnail">{t('Нова сликичка (опционално)', 'New Thumbnail (optional)')}</Label>
    ...
  </div>
```

**Updated code:**
```tsx
<div className="space-y-4 border-t pt-4">
  {/* Only show thumbnail field for non-image types (books, periodicals) */}
  {editingItem?.type !== 'image' && (
    <div className="space-y-2">
      <Label htmlFor="edit_thumbnail">{t('Нова сликичка (опционално)', 'New Thumbnail (optional)')}</Label>
      ...
    </div>
  )}
```

### Result
| Item Type | "Примарна Слика" | "Нова сликичка" |
|-----------|------------------|-----------------|
| Image/Testimonial | Visible | Hidden |
| Book | Hidden | Visible |
| Periodical | Hidden | Visible |

This removes confusion and keeps only the relevant upload option for each item type.
