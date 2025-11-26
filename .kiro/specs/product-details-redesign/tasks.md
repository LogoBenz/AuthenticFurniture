# Implementation Plan

- [x] 1. Update page layout and spacing



  - Modify `app/products/[slug]/page.tsx` to reduce top padding from `pt-24` to `pt-16`
  - Change grid layout to implement 60/40 split using `grid-cols-1 lg:grid-cols-[1.5fr_1fr]`
  - Adjust grid gap from `gap-8 lg:gap-12` to `gap-6 lg:gap-10`
  - Remove centered Popular Badge wrapper and integrate badge into product info section
  - _Requirements: 2.1, 2.2, 2.3_

- [x] 2. Redesign Popular Badge component



  - Update badge styling in `app/products/[slug]/page.tsx` or create separate component
  - Set width to `auto` with `max-w-[180px]` and height to `h-8` (32px)
  - Apply `rounded-full` for capsule style with `bg-gray-100` background
  - Use `text-sm font-semibold text-gray-800` for text styling
  - Add hover effect with `hover:bg-gray-200 transition-colors duration-200`
  - Reposition badge to top of product info section instead of centered above layout
  - Reduce icon size to 16px and ensure subtle styling
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

- [x] 3. Enhance product image gallery



- [x] 3.1 Update desktop thumbnail layout


  - Modify `components/products/EnhancedProductGallery.tsx` thumbnail container
  - Increase thumbnail width from `w-20` to `w-24` (96px)
  - Update thumbnail size to `w-24 h-24` for both width and height
  - Change thumbnail spacing from `space-y-2` to `space-y-3` (12px gap)
  - Update active thumbnail border to `border-2 border-blue-800`
  - Update inactive thumbnail border to `border border-gray-200 hover:border-gray-300`
  - _Requirements: 4.2, 4.3, 4.1_


- [x] 3.2 Refine main image display


  - Update main image container border to `border border-gray-200`
  - Reduce hover scale from `hover:scale-105` to `hover:scale-[1.02]`
  - Update navigation arrow background to `bg-white/95`
  - Ensure Next.js Image component uses `priority` prop for main image
  - Add a bottom-right overlay showing the current image index (e.g. "1/3") using a small rounded box with `bg-black/60 px-2 py-1 text-xs text-white rounded`
  - Position the image counter overlay at `absolute bottom-2 right-2`
  - _Requirements: 4.1, 4.4, 4.5_




- [x] 3.3 Update thumbnail layout to horizontal bottom

  - Convert thumbnail layout from vertical-left to horizontal bottom on ALL viewports
  - Position thumbnails below main image using flex column layout
  - Use horizontal scroll with `overflow-x-auto scrollbar-hide`
  - Set thumbnail size to `w-20 h-20` with `space-x-2` (8px) spacing
  - Ensure thumbnails are centered below the main image
  - _Requirements: 4.6, 2.4_

- [x] 4. Refine product information section




- [x] 4.1 Update product title and pricing with model number

  - Modify `components/products/EnhancedProductInfo.tsx` title section
  - Ensure title uses `text-3xl lg:text-4xl font-bold text-gray-900`
  - Add product model number UNDER the product name using `text-sm text-gray-500`
  - Set current price to `text-3xl font-bold text-gray-900`
  - Update original price to `text-xl text-gray-500 line-through`
  - Redesign discount badge with `bg-red-50 text-red-700 border border-red-200 rounded-full px-3 py-1`
  - Increase spacing around title, price sections
  - _Requirements: 5.1, 5.3, 5.5, 1.2_



- [x] 4.2 Redesign action buttons with proper colors

  - Update "Add to Cart" button to `bg-blue-600 hover:bg-blue-700 text-white shadow-sm`
  - Update "Buy Now (WhatsApp)" button to `bg-green-600 hover:bg-green-700 text-white shadow-sm`
  - Set button height to `h-12` (48px) for better touch targets
  - Apply `rounded-lg` (12px) border radius to buttons
  - Ensure icon size is `w-5 h-5` (20px)
  - Maintain grid layout `grid grid-cols-1 sm:grid-cols-2 gap-3`
  - Add proper spacing between buttons


  - _Requirements: 5.2, 5.4, 2.5, 1.3_

- [x] 4.3 Update quantity selector UI

  - Update plus/minus buttons to cleaner centered version
  - Ensure buttons are properly aligned and sized
  - Apply consistent styling with rounded corners


  - Maintain proper spacing between quantity controls
  - _Requirements: 5.1, 1.3_

- [x] 4.4 Update feature row with premium card style

  - Wrap entire row (Free Shipping / Delivery / Warranty) in light gray background container
  - Apply `bg-gray-50 rounded-lg p-6` for premium card style
  - Replace all current icons (shipping, delivery, warranty) with premium SVG icons from freesvgicons.com
  - Store premium SVG icons in `public/icons/premium/` directory (create if needed) or add to `components/icons/FurnitureIcons.tsx`
  - DO NOT use Heroicons or Lucide-react icons for this section - use only the external premium SVG icons
  - Ensure all imported SVGs render crisply at `w-6 h-6` and are colorized using `text-blue-600`
  - Update title to `text-sm font-semibold text-gray-900`
  - Update subtitle to `text-xs text-gray-600`
  - Apply consistent padding (top & bottom) and spacing


  - Ensure the payment methods section uses the exact same `bg-gray-50` tone, border radius, padding, and spacing so both sections appear as a unified premium style
  - Match vertical spacing above and below both card sections to maintain consistent visual rhythm
  - _Requirements: 5.2, 1.3, 1.4_

- [x] 5. Redesign payment methods section with premium styling

  - Wrap payment methods section in light gray background container
  - Apply `bg-gray-50 rounded-lg p-6` matching feature row style EXACTLY (same tone, same padding, same border radius)
  - Replace all current payment icons (POS, bank transfer, pay on delivery) with premium SVG icons from freesvgicons.com
  - Store premium SVG icons in `public/icons/premium/` directory (create if needed) or add to `components/icons/FurnitureIcons.tsx`
  - DO NOT use Heroicons or Lucide-react icons for this section - use only the external premium SVG icons
  - Ensure all imported SVGs render crisply at `w-6 h-6` and are colorized using `text-gray-700` or `text-blue-600` depending on context
  - Increase spacing and padding for cleaner layout
  - Maintain grid layout `grid grid-cols-1 sm:grid-cols-3 gap-4`
  - Update text to `text-sm text-gray-700`

  - Update heading to `text-sm font-semibold text-gray-900 mb-4`
  - Ensure vertical spacing between this section and the feature row above matches perfectly for unified premium appearance
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 1.3_

- [x] 6. Standardize social share icons


  - Update social share section in `components/products/EnhancedProductInfo.tsx`
  - Change button style to `w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg`
  - Set default icon color to `text-gray-600`
  - Add hover styles `hover:text-blue-800 hover:border-blue-800 hover:bg-blue-50`
  - Add hover scale effect `hover:scale-110 transition-all duration-200`
  - Ensure icon size is `w-5 h-5` (20px)
  - Update spacing to `space-x-2` (8px gap)
  - Update label to `text-sm font-medium text-gray-700`
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 1.3_

- [x] 7. Enhance key features section



  - Modify features section in `components/products/EnhancedProductTabs.tsx`
  - Import `Check` icon from `lucide-react`
  - Replace colored bullet points with `Check` icons
  - Set icon styling to `w-4 h-4 text-gray-700 mt-0.5 flex-shrink-0`
  - Update layout to `grid grid-cols-1 md:grid-cols-2 gap-3`
  - Update feature text to `text-sm text-gray-700`
  - Set spacing to `space-x-3` between icon and text
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 1.3_



- [x] 8. Refine tabs section styling



- [x] 8.1 Update tab navigation

  - Modify tab navigation in `components/products/EnhancedProductTabs.tsx`
  - Update border to `border-b border-gray-200`
  - Set active tab to `border-b-2 border-blue-800 text-blue-800`
  - Set inactive tab to `border-transparent text-gray-600 hover:text-gray-900`
  - Update tab spacing to `space-x-8` (32px gap)
  - Set tab padding to `py-4 px-1`
  - Update font to `text-sm font-medium`
  - Ensure icon size is `w-4 h-4`
  - _Requirements: 9.1, 9.4, 9.5, 1.2_


- [x] 8.2 Update tab content styling

  - Set content padding to `py-8` (32px top/bottom)
  - Update section headings to `text-lg font-semibold text-gray-900`
  - Update body text to `text-sm text-gray-700 leading-relaxed`
  - Set spacing between sections to `space-y-6` (24px)
  - Update specifications grid to `grid grid-cols-1 md:grid-cols-2 gap-6`
  - Set label styling to `text-sm text-gray-600`

  - Set value styling to `text-sm font-medium text-gray-900`
  - Update row spacing to `space-y-3` (12px)
  - _Requirements: 9.2, 9.3, 1.2_

- [x] 9. Verify responsive behavior

  - Test page on mobile viewport (375px width)
  - Verify image gallery thumbnails collapse to horizontal scroll
  - Confirm all content stacks vertically without crowding
  - Check that margins and font sizes remain appropriate

  - Verify all interactive elements have minimum 44x44px touch targets
  - Test on tablet viewport (768px width)
  - Confirm grid adjustments work correctly
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 2.4, 2.5_

- [x] 10. Accessibility and semantic HTML audit

  - Review all components for semantic HTML usage
  - Verify ARIA labels are present on all interactive elements
  - Check heading hierarchy (h1, h2, h3) is logical
  - Test keyboard navigation through all interactive elements
  - Verify focus indicators are visible
  - Test with screen reader to ensure proper announcements

  - _Requirements: 11.4_


- [x] 11. Visual regression and cross-browser testing


  - Test on desktop viewport (1920x1080) in Chrome, Firefox, Safari, Edge
  - Test on tablet viewport (768x1024) in Chrome and Safari
  - Test on mobile viewport (375x667) in Chrome Mobile and Safari iOS
  - Verify 60/40 layout split on desktop
  - Check all hover states function correctly

  - Verify color contrast meets WCAG AA standards (4.5:1)
  - Measure and optimize Core Web Vitals (LCP, CLS, FID)
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 10.5_
