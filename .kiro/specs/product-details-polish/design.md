# Product Details Page Polish - Design Document

## Overview

This design document outlines the technical approach for implementing polish enhancements to the product details page. The implementation builds upon the existing EnhancedProductGallery, EnhancedProductInfo, and EnhancedProductTabs components to deliver a premium, professional user experience with smooth interactions, proper loading states, error handling, and accessibility improvements.

## Architecture

### Component Structure

The polish implementation maintains the existing component architecture while enhancing each component with additional features:

```
app/products/[slug]/page.tsx (Server Component)
├── EnhancedProductGallery (Client Component)
│   ├── Image Gallery with aspect ratio adjustments
│   ├── Skeleton loading states
│   ├── Error fallback handling
│   └── Smooth hover interactions
├── EnhancedProductInfo (Client Component)
│   ├── Compact quantity/action layout
│   ├── Premium badge styling
│   ├── Typography refinements
│   ├── Gray background sections
│   ├── Custom SVG icons
│   └── Social media hover effects
└── EnhancedProductTabs (Client Component)
    ├── Reordered tab content
    └── Mobile-optimized layout
```

### State Management

- **Local Component State**: Each component manages its own UI state (loading, errors, interactions)
- **No Global State Changes**: Existing useEnquiryCart hook remains unchanged
- **Progressive Enhancement**: Features degrade gracefully when JavaScript is disabled

## Components and Interfaces

### 1. EnhancedProductGallery Enhancements

#### Image Aspect Ratio & Alignment
```typescript
// Update main image container
<div className="relative aspect-[8/5] bg-white rounded-lg overflow-hidden border border-gray-200 group">
  {/* Image content */}
</div>

// Update thumbnail section with mt-3 for alignment
<div className="flex justify-center mt-3">
  {/* Thumbnails */}
</div>
```

#### Loading Skeleton
```typescript
interface GallerySkeletonProps {
  aspectRatio?: string;
}

function GallerySkeleton({ aspectRatio = "aspect-[8/5]" }: GallerySkeletonProps) {
  return (
    <div className={`${aspectRatio} bg-gray-200 rounded-lg animate-pulse relative overflow-hidden`}>
      <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
    </div>
  );
}
```

#### Error Fallback
```typescript
interface ImageErrorState {
  hasError: boolean;
  retryCount: number;
}

function ImageFallback({ productName, category }: { productName: string; category?: string }) {
  return (
    <div className="aspect-[8/5] bg-gray-100 rounded-lg flex flex-col items-center justify-center">
      <Package className="w-16 h-16 text-gray-400 mb-2" />
      <p className="text-gray-600 font-medium">{category || 'Product'}</p>
      <p className="text-gray-500 text-sm">{productName}</p>
    </div>
  );
}
```

#### Hover Interactions
```typescript
// Thumbnail hover effect
className="hover:scale-105 transition-transform duration-200"

// Main image subtle zoom
className="group-hover:scale-[1.02] transition-transform duration-300"
```

### 2. EnhancedProductInfo Enhancements

#### Compact Quantity & Action Layout
```typescript
// Inline layout for desktop
<div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
  {/* Quantity selector */}
  <div className="flex items-center space-x-2">
    <button className="w-8 h-8 flex items-center justify-center border rounded-lg hover:bg-gray-50 transition-colors">
      <Minus className="w-4 h-4" />
    </button>
    <span className="w-12 text-center font-medium leading-none">{quantity}</span>
    <button className="w-8 h-8 flex items-center justify-center border rounded-lg hover:bg-gray-50 transition-colors">
      <Plus className="w-4 h-4" />
    </button>
  </div>
  
  {/* Action buttons */}
  <div className="flex gap-2 flex-1">
    <Button className="h-10 flex-1 hover:scale-[1.02] transition-all duration-200">
      ADD TO CART
    </Button>
    <Button className="h-10 flex-1 hover:scale-[1.02] transition-all duration-200">
      BUY NOW
    </Button>
  </div>
</div>
```

#### Premium Badge Styling
```typescript
// Gradient badges
<Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm rounded-full">
  {badge.text}
</Badge>

// Popular tag with gradient
<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm">
  <Star className="w-4 h-4" />
  <span>Popular with {category}</span>
</div>

// Model number with chip styling
<div className="flex items-center gap-2 text-sm text-gray-600">
  <Code className="w-4 h-4" />
  <span className="px-2 py-1 bg-gray-100 rounded-md font-mono text-xs">
    {product.modelNo}
  </span>
</div>
```

#### Typography Refinements
```typescript
// Price display
<span className="text-[26px] font-semibold text-gray-900">
  {formatPrice(price)}
</span>

// Button text
<Button className="font-medium text-base">
  ADD TO CART
</Button>

// Section labels
<label className="text-sm font-medium text-gray-700">
  Quantity
</label>
```

#### Custom SVG Icons Integration
```typescript
// Create SVG icon components from svg-icons-reference.md
const FreeShippingIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    {/* SVG path from reference */}
  </svg>
);

// Usage in feature section
<div className="flex items-start space-x-3">
  <FreeShippingIcon className="w-7 h-7 text-gray-800 flex-shrink-0 mt-0.5" />
  <div>
    <p className="text-sm font-semibold text-gray-900">Free Shipping</p>
    <p className="text-xs text-gray-600">Orders over ₦1,000,000</p>
  </div>
</div>
```

#### Social Media Hover Effects
```typescript
const socialColors = {
  facebook: { text: '#1877F2', bg: 'bg-blue-50' },
  twitter: { text: '#1DA1F2', bg: 'bg-blue-50' },
  instagram: { text: '#E4405F', bg: 'bg-pink-50' }
};

<button
  className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg text-gray-600 hover:scale-110 transition-all duration-200"
  style={{
    '--hover-color': socialColors.facebook.text
  } as React.CSSProperties}
  onMouseEnter={(e) => {
    e.currentTarget.style.color = socialColors.facebook.text;
    e.currentTarget.style.borderColor = socialColors.facebook.text;
    e.currentTarget.classList.add(socialColors.facebook.bg);
  }}
>
  <Facebook className="w-5 h-5" />
</button>
```

#### Gray Background Sections
```typescript
// Feature section
<div className="bg-gray-100 rounded-lg p-6 space-y-4">
  {/* Feature content */}
</div>

// Payment methods section
<div className="bg-gray-100 rounded-lg p-6">
  {/* Payment methods content */}
</div>

// Mobile responsive padding
<div className="bg-gray-100 rounded-lg p-4 sm:p-6">
  {/* Content */}
</div>
```

### 3. Breadcrumb Component

Create a new reusable Breadcrumb component:

```typescript
interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center space-x-2 text-sm">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
            )}
            {item.href ? (
              <a 
                href={item.href} 
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                {item.label}
              </a>
            ) : (
              <span className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-none">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
```

### 4. Loading States

#### Product Page Skeleton
```typescript
export function ProductPageSkeleton() {
  return (
    <div className="container mx-auto px-4 max-w-7xl pt-6">
      {/* Breadcrumb skeleton */}
      <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mb-6" />
      
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 lg:gap-10">
        {/* Gallery skeleton */}
        <GallerySkeleton />
        
        {/* Info skeleton */}
        <div className="space-y-4">
          <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse" />
          <div className="h-6 w-1/2 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
```

## Data Models

No new data models required. All enhancements work with the existing Product type:

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
  modelNo?: string;
  dimensions?: string;
  materials?: string;
  weight_capacity?: string;
  warranty?: string;
  features?: string[];
  popular_with?: string[];
  stock_count?: number;
  ships_from?: string;
  delivery_timeframe?: string;
  bulk_pricing_enabled?: boolean;
  bulk_pricing_tiers?: BulkPricingTier[];
  limited_time_deal?: LimitedTimeDeal;
  // ... other existing fields
}
```

## Error Handling

### Image Loading Errors

```typescript
function useImageWithFallback(src: string, fallback: string) {
  const [imgSrc, setImgSrc] = useState(src);
  const [retryCount, setRetryCount] = useState(0);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (retryCount < 1) {
      // Retry once
      setRetryCount(prev => prev + 1);
      setImgSrc(`${src}?retry=${retryCount + 1}`);
    } else {
      // Show fallback
      setHasError(true);
      setImgSrc(fallback);
    }
  };

  return { imgSrc, hasError, handleError };
}
```

### Component Error Boundaries

```typescript
class ProductGalleryErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Gallery error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
```

## Testing Strategy

### Unit Tests
- Test quantity selector increment/decrement logic
- Test price calculations with bulk pricing
- Test image error handling and retry logic
- Test social share URL generation

### Component Tests
- Test skeleton loading states render correctly
- Test error fallbacks display properly
- Test hover interactions trigger correctly
- Test mobile responsive layouts

### Integration Tests
- Test complete product page load flow
- Test image gallery navigation
- Test quantity changes update total price
- Test WhatsApp enquiry message generation

### Accessibility Tests
- Test keyboard navigation through all interactive elements
- Test screen reader announcements
- Test focus states visibility
- Test color contrast ratios (WCAG AA)
- Test ARIA labels and roles

### Performance Tests
- Measure Largest Contentful Paint (LCP) < 2.5s
- Measure First Input Delay (FID) < 100ms
- Measure Cumulative Layout Shift (CLS) < 0.1
- Test image lazy loading effectiveness

### Visual Regression Tests
- Compare before/after screenshots of key states
- Test responsive breakpoints (mobile, tablet, desktop)
- Test hover states and animations
- Test loading and error states

## Performance Optimization

### Image Optimization
```typescript
// Priority loading for main image
<Image
  src={mainImage}
  alt={productName}
  fill
  priority
  sizes="(max-width: 768px) 100vw, 50vw"
/>

// Lazy loading for thumbnails
<Image
  src={thumbnail}
  alt={`Thumbnail ${index}`}
  fill
  loading="lazy"
  placeholder="blur"
  blurDataURL={generateBlurDataURL()}
/>
```

### Component Memoization
```typescript
// Memoize expensive calculations
const totalPrice = useMemo(
  () => calculateTotalPrice(quantity, bulkPrice),
  [quantity, bulkPrice]
);

// Memoize static components
const PaymentMethods = memo(PaymentMethodsComponent);
const FeatureSection = memo(FeatureSectionComponent);
```

### Code Splitting
```typescript
// Lazy load related products
const RelatedProducts = dynamic(
  () => import('@/components/products/RelatedProducts'),
  { loading: () => <RelatedProductsSkeleton /> }
);

// Lazy load tabs content
const ProductTabs = dynamic(
  () => import('@/components/products/EnhancedProductTabs'),
  { ssr: true }
);
```

### CSS Animations
```css
/* Add to globals.css for shimmer effect */
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}
```

## Mobile-Specific Considerations

### Touch Targets
- Minimum 44px touch target size for all interactive elements
- Increased spacing between buttons on mobile
- Larger quantity selector buttons

### Layout Adjustments
```typescript
// Stack quantity and actions vertically on mobile
<div className="flex flex-col sm:flex-row gap-3">
  {/* Quantity selector */}
  {/* Action buttons */}
</div>

// Full-width gallery on mobile
<div className="w-full lg:w-auto">
  <EnhancedProductGallery />
</div>

// Horizontal scroll for tabs
<div className="overflow-x-auto snap-x snap-mandatory">
  {tabs.map(tab => (
    <div className="snap-start">{tab.content}</div>
  ))}
</div>
```

### Performance on Mobile
- Reduce animation complexity on low-end devices
- Use `will-change` sparingly
- Optimize image sizes for mobile viewports

## Accessibility Implementation

### Keyboard Navigation
```typescript
// Tab navigation with arrow keys
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === 'ArrowRight') {
    setActiveTab(nextTab);
  } else if (e.key === 'ArrowLeft') {
    setActiveTab(prevTab);
  }
};
```

### Screen Reader Support
```typescript
// Announce quantity changes
<div role="status" aria-live="polite" className="sr-only">
  Quantity updated to {quantity}
</div>

// Descriptive button labels
<button aria-label={`Add ${product.name} to cart`}>
  ADD TO CART
</button>
```

### Focus Management
```css
/* Visible focus states */
.focus-visible:focus {
  @apply ring-2 ring-blue-600 ring-offset-2 outline-none;
}
```

### Color Contrast
- All text meets WCAG AA standards (4.5:1 for normal text, 3:1 for large text)
- Interactive elements have sufficient contrast in all states
- Error messages use both color and icons

## Implementation Notes

### SVG Icons
- All custom SVG icons are stored in `svg-icons-reference.md`
- Icons are inlined to avoid network requests
- Icons use currentColor for easy theming
- Consistent sizing: w-5 h-5 for features, w-7 h-7 for payment methods

### Animation Performance
- Use `transform` and `opacity` for animations (GPU-accelerated)
- Avoid animating `width`, `height`, `top`, `left`
- Use `will-change` only during active animations
- Prefer CSS transitions over JavaScript animations

### Browser Compatibility
- Target modern browsers (last 2 versions)
- Provide fallbacks for CSS features (aspect-ratio, backdrop-filter)
- Test on Safari, Chrome, Firefox, Edge
- Ensure graceful degradation

### Deployment Considerations
- No database migrations required
- No API changes needed
- Can be deployed incrementally
- Backward compatible with existing data
