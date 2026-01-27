
## Fix: Weird Background Colors on Primary Image

### Problem Identified
When viewing a testimonial/image item on the detail page, the primary photo displays with an unexpected background color in the empty space around the image. This happens because:

1. The image container uses `object-contain` which preserves the image's aspect ratio, leaving empty space when the image doesn't fill the container
2. The container has no explicit background color set
3. The empty space shows whatever background is inherited, which appears as an odd brownish/tan tint (possibly due to the `shadow-elegant` effect or transparency)

The secondary images don't have this issue because they may have different container styling or fill their containers differently.

### Solution
Add an explicit neutral/white background color to the primary image container div to ensure consistent appearance.

### File to Modify

**`src/pages/ItemDetail.tsx` (line 266)**

Current code:
```tsx
className={`rounded-lg overflow-hidden shadow-elegant ${item.type === "book" ? "aspect-[2/3] max-h-[400px]" : "aspect-[3/4]"} relative group ${item.type === "image" && allImages.length > 0 ? "cursor-pointer" : ""}`}
```

Updated code - add `bg-white` (or `bg-background` for theme-aware white):
```tsx
className={`rounded-lg overflow-hidden shadow-elegant bg-background ${item.type === "book" ? "aspect-[2/3] max-h-[400px]" : "aspect-[3/4]"} relative group ${item.type === "image" && allImages.length > 0 ? "cursor-pointer" : ""}`}
```

### Why This Works
- `bg-background` uses the theme's background color (white in light mode, dark in dark mode)
- This ensures that when `object-contain` creates empty space around the image, it shows a clean, consistent background color
- The fix is theme-aware and will work correctly in both light and dark modes
