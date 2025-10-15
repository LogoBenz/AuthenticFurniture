# Sidebar Scrollbar - Hide by Default, Show on Hover

## Changes Made

### 1. Custom CSS Utilities (`app/globals.css`)
Added new utility classes for scrollbar behavior:

- **`.scrollbar-hide`** - Completely hides the scrollbar (already existed)
- **`.scrollbar-hover`** - Shows a thin, styled scrollbar only when hovering

### 2. Scrollbar Styling
When hovering over the sidebar navigation:
- **Width**: 6px (thin and unobtrusive)
- **Color**: Semi-transparent slate gray
- **Border radius**: 3px (rounded)
- **Hover effect**: Slightly darker on thumb hover
- **Dark mode**: Adjusted colors for dark theme

### 3. Sidebar Navigation Update
Applied both utility classes to the navigation element:
```tsx
className="scrollbar-hide scrollbar-hover"
```

## Behavior

### Default State:
- ✅ Scrollbar is completely hidden
- ✅ Content is still scrollable with mouse wheel or trackpad
- ✅ Clean, minimal appearance

### On Hover:
- ✅ Thin scrollbar appears smoothly
- ✅ Styled to match the design system
- ✅ Works in both light and dark modes
- ✅ Disappears when mouse leaves

## Browser Support

- **Chrome/Edge**: Uses `::-webkit-scrollbar` pseudo-elements
- **Firefox**: Uses `scrollbar-width` and `scrollbar-color`
- **Safari**: Uses `::-webkit-scrollbar` pseudo-elements

## Technical Details

The implementation uses CSS-only solution with:
- `scrollbar-width: none` for Firefox
- `-ms-overflow-style: none` for IE/Edge
- `::-webkit-scrollbar { display: none }` for Chrome/Safari
- Hover state reveals styled scrollbar with proper theming
