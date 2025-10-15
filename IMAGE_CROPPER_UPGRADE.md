# Image Cropper Upgrade

## What Changed

Replaced custom image cropper with **react-easy-crop** library for better reliability and UX.

## Files

- **`components/ui/image-cropper.tsx`** - New cropper using react-easy-crop
- **`components/ui/image-cropper-old.tsx`** - Backup of custom cropper (can be deleted later)
- **`app/api/proxy-image/route.ts`** - API route to proxy Supabase images (fixes CORS)

## Features

✅ **Huge modal** - Takes up 95% of screen (z-index 9999)
✅ **Rectangular crop** - Default 4:3 aspect ratio for furniture
✅ **Smooth zoom** - Scroll wheel or slider to zoom
✅ **Drag to reposition** - Intuitive dragging
✅ **High quality** - Crops at full resolution (95% JPEG quality)
✅ **CORS fixed** - Uses proxy API route

## Usage

The component is already integrated in:
- `app/admin/products/page.tsx`
- `components/products/EnhancedMediaUpload.tsx`

No changes needed - it uses the same interface as the old cropper.

## Why react-easy-crop?

- Battle-tested library with 2M+ downloads/month
- Handles all coordinate transformations automatically
- Smooth zoom and pan
- Mobile-friendly (touch support)
- Actively maintained

## Configuration

To change aspect ratio, modify the `aspectRatio` prop:
- `4/3` - Default for furniture (landscape)
- `1` - Square
- `16/9` - Wide landscape
- `3/4` - Portrait

Example:
```tsx
<ImageCropper
  imageUrl={url}
  onCropComplete={handleCrop}
  onCancel={handleCancel}
  aspectRatio={16/9} // Wide landscape
/>
```

## Troubleshooting

If images don't load:
1. Check browser console for errors
2. Verify `SUPABASE_SERVICE_ROLE_KEY` is set in `.env.local`
3. Check that proxy API route is working: `/api/proxy-image?bucket=product-images&path=test.jpg`
