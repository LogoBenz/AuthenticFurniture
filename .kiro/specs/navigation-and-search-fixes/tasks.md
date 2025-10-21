# Implementation Plan

- [x] 1. Fix Popular Categories navigation links

  - Update the `popularCategories` array in `components/home/Categories.tsx` to use correct subcategory slugs
  - Change link generation from `/products?category=` to `/products?subcategory=`
  - Verify each category card links to the correct filtered products page
  - _Requirements: 1.3, 1.4_

- [x] 2. Verify and fix Shop by Space dropdown links

  - Review link generation in `components/layout/Header.tsx` for the "Shop by Space" mega menu
  - Review link generation in `components/layout/CrazyNavbar.tsx` for the "Shop by Space" mega menu
  - Ensure space links use `/products?space={slug}` format
  - Ensure subcategory links use `/products?space={space-slug}&subcategory={subcategory-slug}` format
  - _Requirements: 1.1, 1.2_

- [x] 3. Create search functionality in lib/products.ts

  - Add `searchProducts(query: string)` function to filter products by name, category, description, and features
  - Implement Supabase query with `.or()` clause for multiple field matching
  - Add fallback to client-side filtering when Supabase is unavailable
  - Limit results to 10 products for performance
  - _Requirements: 3.1, 3.2, 3.3_

- [x] 4. Create SearchModal component

- [x] 4.1 Create base SearchModal component structure

  - Create `components/ui/SearchModal.tsx` with TypeScript interface
  - Implement full-screen modal overlay with backdrop blur
  - Add AnimatePresence wrapper for smooth entrance/exit animations
  - Set up modal open/close state management
  - _Requirements: 2.1, 2.7_

- [x] 4.2 Implement animated placeholder text rotation

  - Create array of placeholder examples (office tables, conference tables, student desks, outdoor seating for bars, etc.)
  - Implement useEffect hook to rotate placeholders every 2 seconds
  - Add smooth fade transition between placeholder changes
  - _Requirements: 2.2_

- [x] 4.3 Build search input with real-time filtering

  - Create large, centered search input with auto-focus
  - Implement debounced search with 300ms delay using useEffect
  - Call searchProducts function from lib/products.ts
  - Display loading spinner during search
  - _Requirements: 2.4, 3.1_

- [x] 4.4 Create search results display

  - Build product result cards with image, name, price, and stock status
  - Implement grid layout (2 columns on mobile, 3 on desktop)
  - Add click handler to navigate to product detail page
  - Show result count above the grid
  - _Requirements: 2.5, 2.6_

- [x] 4.5 Implement empty and default states

  - Create empty state component for no results with suggestions
  - Create default state showing popular products when search is empty
  - Add helpful text and category suggestions
  - _Requirements: 2.9, 2.10, 3.5_

- [x] 4.6 Add keyboard navigation and accessibility

  - Implement Escape key to close modal
  - Add click outside to close functionality
  - Implement focus trap within modal
  - Add proper ARIA labels and roles
  - _Requirements: 2.7_

- [x] 4.7 Make SearchModal mobile responsive

  - Adjust layout for mobile viewport (full screen, reduced padding)
  - Use single-column grid for results on mobile
  - Handle keyboard appearance on mobile devices
  - Test touch interactions and scrolling
  - _Requirements: 2.8, 4.1, 4.2, 4.3, 4.4_

- [x] 5. Integrate SearchModal into Header components

  - Add SearchModal state management to `components/layout/Header.tsx`
  - Replace search Popover with SearchModal trigger button
  - Add SearchModal component with isOpen and onClose props
  - Repeat integration for `components/layout/CrazyNavbar.tsx`
  - _Requirements: 2.1_

- [x] 6. Test navigation and search functionality


  - Manually test all Popular Categories links navigate to correct filtered pages
  - Manually test all Shop by Space dropdown links
  - Test search modal opens and closes correctly
  - Test search returns relevant results
  - Test mobile responsiveness of both navigation and search
  - Verify no products found states display correctly
  - _Requirements: 1.5, 2.9, 3.5, 4.5_
