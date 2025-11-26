# Design Document

## Overview

This design document outlines the comprehensive redesign of the Authentic Furniture product details page. The redesign transforms the current "vibe-coded" implementation into a premium, professional interface that communicates trust and quality. The design follows modern e-commerce best practices while maintaining the brand's identity and ensuring all existing functionality is preserved.

The redesign focuses on visual refinement, improved information hierarchy, and enhanced user experience across all devices. The aesthetic draws inspiration from premium furniture retailers like IKEA and Herman Miller, emphasizing clean lines, ample white space, and sophisticated typography.

## Architecture

### Component Structure

The product details page consists of several key components that will be refactored:

```
app/products/[slug]/page.tsx (Main page component)
├── EnhancedProductGallery (Image gallery with thumbnails)
├── EnhancedProductInfo (Product details and actions)
├── EnhancedProductTabs (Specifications, delivery, reviews)
└── RelatedProducts (Product recommendations)
```

### Design System Foundation

**Color Palette:**
- Primary Background: `#FFFFFF` (white)
- Secondary Background: `#F9FAFB` (gray-50)
- Text Primary: `#111827` (gray-900)
- Text Secondary: `#6B7280` (gray-500)
- Brand Accent: `#1E40AF` (blue-800)
- Border: `#E5E7EB` (gray-200)
- Hover States: `#DBEAFE` (blue-50)

**Typography:**
- Font Family: Inter or Poppins (system fallback: -apple-system, BlinkMacSystemFont, "Segoe UI")
- Heading 1: 36px/40px, font-weight: 700
- Heading 2: 24px/32px, font-weight: 600
- Heading 3: 18px/28px, font-weight: 600
- Body: 16px/24px, font-weight: 400
- Small: 14px/20px, font-weight: 400
- Tiny: 12px/16px, font-weight: 400

**Spacing Scale:**
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px
- 3xl: 64px

**Border Radius:**
- Small: 4px
- Medium: 8px
- Large: 12px
- Full: 9999px (for pills/badges)

## Components and Interfaces

### 1. Page Layout Component

**File:** `app/products/[slug]/page.tsx`

**Design Changes:**
- Reduce top padding from `pt-24` to `pt-16` to bring content higher
- Remove centered Popular Badge wrapper, integrate into product info section
- Adjust grid gap from `gap-8 lg:gap-12` to `gap-6 lg:gap-10` for tighter layout
- Implement 60/40 split: `grid-cols-1 lg:grid-cols-[1.5fr_1fr]`

**Layout Structure:**
```
<div className="pt-16 pb-16">
  <div className="container mx-auto px-4 max-w-7xl">
    <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 lg:gap-10 mb-12">
      {/* 60% - Image Gallery */}
      <EnhancedProductGallery />
      
      {/* 40% - Product Info */}
      <EnhancedProductInfo />
    </div>
    
    <EnhancedProductTabs />
    <RelatedProducts />
  </div>
</div>
```

### 2. Popular Badge Component

**Design Specifications:**
- Width: `auto` with `max-w-[180px]`
- Height: `h-8` (32px)
- Background: `bg-gray-100` with subtle hover effect
- Border: None (clean capsule)
- Border Radius: `rounded-full`
- Padding: `px-3 py-1.5`
- Typography: `text-sm font-semibold text-gray-800`
- Icon: Optional, 16px, positioned left with `mr-2`
- Position: Integrated at top of product info section, not centered above

**Component Structure:**
```tsx
{product.popular_with && product.popular_with.length > 0 && (
  <div className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors duration-200 mb-4">
    <span className="text-base">⭐</span>
    <span>Popular with {product.popular_with[0]}</span>
  </div>
)}
```

### 3. Enhanced Product Gallery

**File:** `components/products/EnhancedProductGallery.tsx`

**Design Changes:**

**Desktop Layout:**
- Thumbnail strip: Fixed width `w-24` (96px) on left
- Thumbnail size: `w-24 h-24` (increased from 80px)
- Thumbnail spacing: `space-y-3` (12px gap)
- Main image: Flex-1 with larger display area
- Border: `border border-gray-200` (subtle, not heavy)
- Border radius: `rounded-lg` (12px)
- Active thumbnail: `border-2 border-blue-800` (brand color)
- Inactive thumbnail: `border border-gray-200 hover:border-gray-300`

**Mobile Layout:**
- Thumbnails: Horizontal scroll strip below main image
- Thumbnail size: `w-20 h-20` (80px)
- Spacing: `space-x-2` (8px gap)
- Scroll behavior: `overflow-x-auto scrollbar-hide`

**Hover States:**
- Main image: Subtle scale `hover:scale-[1.02]` (reduced from 1.05)
- Zoom icon: Appears on hover with `opacity-0 group-hover:opacity-100`
- Navigation arrows: Subtle appearance with `bg-white/95` backdrop

**Image Optimization:**
- Use Next.js Image with `priority` for main image
- Lazy load thumbnails
- Maintain aspect ratio with `aspect-square`
- Object fit: `object-cover`

### 4. Enhanced Product Info

**File:** `components/products/EnhancedProductInfo.tsx`

**Design Changes:**

**Popular Badge Integration:**
- Move from centered position to top of product info
- Display as first element before badges

**Product Title:**
- Font size: `text-3xl lg:text-4xl` (36-40px)
- Font weight: `font-bold`
- Color: `text-gray-900`
- Margin bottom: `mb-3` (12px)
- Model number: `text-sm text-gray-600` below title

**Pricing Section:**
- Current price: `text-3xl font-bold text-gray-900`
- Original price: `text-xl text-gray-500 line-through`
- Discount badge: Redesigned with `bg-red-50 text-red-700 border border-red-200 rounded-full px-3 py-1`
- Spacing: `space-x-3` between elements

**Action Buttons:**
- Primary button (Add to Cart): `bg-blue-800 hover:bg-blue-900 text-white shadow-sm`
- Secondary button (WhatsApp): `border-2 border-gray-300 text-gray-700 hover:bg-gray-50`
- Button height: `h-12` (48px) for better touch targets
- Button radius: `rounded-lg` (12px)
- Icon size: `w-5 h-5` (20px)
- Grid layout: `grid grid-cols-1 sm:grid-cols-2 gap-3`

**Info Row (Shipping, Delivery, Warranty):**
- Background: Remove colored backgrounds
- Layout: `grid grid-cols-1 sm:grid-cols-3 gap-4`
- Icon color: `text-blue-800` (brand color)
- Icon size: `w-5 h-5`
- Title: `text-sm font-semibold text-gray-900`
- Subtitle: `text-xs text-gray-600`
- Border: `border-t border-gray-200 pt-6 mt-6`

### 5. Payment Methods Section

**Design Changes:**
- Remove colored dots (`bg-green-500`, `bg-blue-500`, etc.)
- Replace with monochrome checkmark icons
- Background: `bg-gray-50 rounded-lg p-4`
- Layout: `grid grid-cols-1 sm:grid-cols-3 gap-3`
- Icon: Use `Check` from lucide-react, `w-4 h-4 text-gray-700`
- Text: `text-sm text-gray-700`

**Component Structure:**
```tsx
<div className="bg-gray-50 rounded-lg p-4">
  <h3 className="font-semibold text-gray-900 mb-3 text-sm">Payment Methods</h3>
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
    <div className="flex items-center space-x-2">
      <Check className="w-4 h-4 text-gray-700" />
      <span className="text-sm text-gray-700">Pay on Delivery</span>
    </div>
    {/* Repeat for other methods */}
  </div>
</div>
```

### 6. Social Share Icons

**Design Changes:**
- Icon style: Monochrome outline icons
- Default color: `text-gray-600`
- Hover color: `hover:text-blue-800` (brand color)
- Hover effect: `hover:scale-110 transition-transform duration-200`
- Button style: `border border-gray-300 hover:border-blue-800 hover:bg-blue-50`
- Icon size: `w-5 h-5` (20px)
- Button size: `w-10 h-10` (40px square)
- Border radius: `rounded-lg` (12px)
- Spacing: `space-x-2` (8px gap)

**Component Structure:**
```tsx
<div className="space-y-3">
  <div className="flex items-center space-x-2">
    <Share2 className="w-4 h-4 text-gray-600" />
    <span className="text-sm font-medium text-gray-700">Share:</span>
  </div>
  <div className="flex space-x-2">
    <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg text-gray-600 hover:text-blue-800 hover:border-blue-800 hover:bg-blue-50 transition-all duration-200">
      <Facebook className="w-5 h-5" />
    </button>
    {/* Repeat for other platforms */}
  </div>
</div>
```

### 7. Key Features Section (in EnhancedProductTabs)

**File:** `components/products/EnhancedProductTabs.tsx`

**Design Changes:**
- Remove colored bullet points (`bg-blue-600`, etc.)
- Replace with checkmark icons: `Check` from lucide-react
- Icon color: `text-gray-700`
- Icon size: `w-4 h-4`
- Layout: `grid grid-cols-1 md:grid-cols-2 gap-3`
- Feature text: `text-sm text-gray-700`
- Spacing: `space-x-3` between icon and text

**Component Structure:**
```tsx
<ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
  {product.features.map((feature, index) => (
    <li key={index} className="flex items-start space-x-3">
      <Check className="w-4 h-4 text-gray-700 mt-0.5 flex-shrink-0" />
      <span className="text-sm text-gray-700">{feature}</span>
    </li>
  ))}
</ul>
```

### 8. Enhanced Product Tabs

**Design Changes:**

**Tab Navigation:**
- Border bottom: `border-b border-gray-200`
- Active tab: `border-b-2 border-blue-800 text-blue-800`
- Inactive tab: `border-transparent text-gray-600 hover:text-gray-900`
- Tab spacing: `space-x-8` (32px gap)
- Tab padding: `py-4 px-1`
- Font: `text-sm font-medium`
- Icon size: `w-4 h-4`

**Tab Content:**
- Padding: `py-8` (32px top/bottom)
- Section headings: `text-lg font-semibold text-gray-900`
- Body text: `text-sm text-gray-700 leading-relaxed` (increased line height)
- Spacing between sections: `space-y-6` (24px)

**Specifications Grid:**
- Layout: `grid grid-cols-1 md:grid-cols-2 gap-6`
- Label: `text-sm text-gray-600`
- Value: `text-sm font-medium text-gray-900`
- Row spacing: `space-y-3` (12px)

## Data Models

No changes to existing data models. The redesign maintains all current Product interface properties:

```typescript
interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  original_price?: number;
  discount_percent?: number;
  images: string[];
  videos?: string[];
  features?: string[];
  popular_with?: string[];
  badges?: string[];
  modelNo?: string;
  dimensions?: string;
  materials?: string;
  weight_capacity?: string;
  warranty?: string;
  ships_from?: string;
  delivery_timeframe?: string;
  stock_count?: number;
  bulk_pricing_enabled?: boolean;
  bulk_pricing_tiers?: BulkPricingTier[];
  limited_time_deal?: LimitedTimeDeal;
  // ... other existing properties
}
```

## Error Handling

The redesign maintains all existing error handling:

1. **Image Loading Errors:**
   - Fallback to placeholder image
   - Display "No media available" message
   - Log errors to console for debugging

2. **Product Not Found:**
   - Existing `notFound()` handling remains unchanged
   - Error page displays with appropriate messaging

3. **Data Validation:**
   - Conditional rendering for optional fields
   - Graceful degradation when data is missing
   - Type safety maintained through TypeScript

## Testing Strategy

### Visual Regression Testing

1. **Desktop Viewport (1920x1080):**
   - Verify 60/40 layout split
   - Check thumbnail positioning and sizing
   - Validate spacing and typography
   - Confirm hover states on all interactive elements

2. **Tablet Viewport (768x1024):**
   - Verify responsive grid adjustments
   - Check button sizing and touch targets
   - Validate image gallery behavior

3. **Mobile Viewport (375x667):**
   - Verify stacked layout
   - Check horizontal thumbnail scroll
   - Validate touch target sizes (minimum 44x44px)
   - Confirm text readability

### Component Testing

1. **Popular Badge:**
   - Verify badge only renders when `popular_with` data exists
   - Check width constraints (max 180px)
   - Validate hover animation
   - Test with different text lengths

2. **Image Gallery:**
   - Test thumbnail navigation
   - Verify active state indicators
   - Check zoom functionality
   - Test with varying numbers of images (1, 3, 5+)
   - Validate video thumbnail display

3. **Payment Methods:**
   - Verify icon rendering
   - Check grid layout responsiveness
   - Validate text alignment

4. **Social Share:**
   - Test each platform's share functionality
   - Verify hover states
   - Check icon consistency

### Accessibility Testing

1. **Keyboard Navigation:**
   - Tab through all interactive elements
   - Verify focus indicators are visible
   - Test Enter/Space key activation

2. **Screen Reader:**
   - Verify ARIA labels on all buttons
   - Check image alt text
   - Validate heading hierarchy

3. **Color Contrast:**
   - Verify all text meets WCAG AA standards (4.5:1 for normal text)
   - Check button contrast ratios
   - Validate disabled state visibility

### Cross-Browser Testing

Test on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

### Performance Testing

1. **Image Loading:**
   - Verify Next.js Image optimization
   - Check lazy loading behavior
   - Measure Largest Contentful Paint (LCP)

2. **Layout Shifts:**
   - Measure Cumulative Layout Shift (CLS)
   - Verify skeleton loading states
   - Check image dimension reservations

3. **Interaction Responsiveness:**
   - Measure First Input Delay (FID)
   - Test button click responsiveness
   - Verify smooth animations

## Implementation Notes

### Tailwind Configuration

Ensure the following utilities are available in `tailwind.config.ts`:

```typescript
module.exports = {
  theme: {
    extend: {
      colors: {
        'brand-blue': '#1E40AF',
      },
      gridTemplateColumns: {
        'product-layout': '1.5fr 1fr',
      },
    },
  },
}
```

### Font Loading

Add Inter or Poppins to the project:

```typescript
// app/layout.tsx
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      {children}
    </html>
  )
}
```

### Icon Library

Use `lucide-react` for all icons to maintain consistency:
- Check (for features and payment methods)
- Share2 (for social sharing section)
- Facebook, Instagram, Twitter (for social platforms)
- All existing icons from current implementation

### Responsive Breakpoints

Follow Tailwind's default breakpoints:
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px

### Animation Performance

Use CSS transforms for animations to ensure 60fps:
- `transition-transform` for scale effects
- `transition-colors` for color changes
- `transition-opacity` for fade effects
- Duration: 200ms for most interactions

## Migration Strategy

1. **Phase 1: Layout and Spacing**
   - Update page layout component
   - Adjust grid proportions
   - Reduce top padding

2. **Phase 2: Popular Badge**
   - Redesign badge component
   - Reposition within product info
   - Add hover effects

3. **Phase 3: Image Gallery**
   - Increase thumbnail sizes
   - Refine border styles
   - Update hover states

4. **Phase 4: Product Info**
   - Refine button styles
   - Update info row design
   - Adjust spacing

5. **Phase 5: Payment and Social**
   - Replace colored dots with icons
   - Redesign social share buttons
   - Update hover effects

6. **Phase 6: Tabs and Features**
   - Update tab navigation styles
   - Replace feature bullets with icons
   - Refine typography

7. **Phase 7: Testing and Refinement**
   - Visual regression testing
   - Accessibility audit
   - Performance optimization
   - Cross-browser testing
