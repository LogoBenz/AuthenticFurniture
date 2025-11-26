# Wishlist/Favorites Feature - Implementation Tasks

## Task Overview

This implementation plan breaks down the wishlist feature into incremental, testable steps. Each task builds on previous work and can be verified independently.

---

- [x] 1. Database Setup





- [x] 1.1 Create wishlists table migration

  - Create `supabase/migrations/create_wishlists_table.sql`
  - Define table schema with user_id, product_id, created_at
  - Add unique constraint on (user_id, product_id)
  - Add indexes for user_id and product_id

  - _Requirements: 5.1, 5.2_


- [x] 1.2 Configure RLS policies

  - Create policy for SELECT (users can view own wishlist)
  - Create policy for INSERT (users can add to own wishlist)
  - Create policy for DELETE (users can remove from own wishlist)


  - Test policies with different user scenarios
  - _Requirements: 5.1, 5.2_



- [x] 1.3 Run migration

  - Execute migration on development database
  - Verify table creation
  - Verify RLS policies are active
  - Test with sample data
  - _Requirements: 5.1_

---


- [x] 2. Core Wishlist Hook


- [x] 2.1 Create useWishlist hook structure

  - Create `hooks/use-wishlist.ts` file
  - Define UseWishlistReturn interface
  - Set up state management (wishlist array, loading state)

  - Export hook with basic structure
  - _Requirements: 2.1, 4.1, 5.1_



- [x] 2.2 Implement localStorage operations
  - Create getGuestWishlist() function
  - Create saveGuestWishlist() function
  - Implement add/remove for guest users
  - Handle localStorage errors gracefully
  - _Requirements: 4.1, 4.2, 4.3, 4.4_




- [x] 2.3 Implement database operations
  - Create loadWishlistFromDB() function
  - Create addToWishlistDB() function
  - Create removeFromWishlistDB() function
  - Handle database errors with fallback

  - _Requirements: 5.1, 5.2, 5.4_



- [x] 2.4 Implement wishlist sync on login
  - Detect authentication state changes
  - Merge guest wishlist with database wishlist
  - Clear localStorage after successful merge
  - Handle merge conflicts (duplicates)
  - _Requirements: 5.3_


- [x] 2.5 Add helper functions

  - Implement isInWishlist(productId)
  - Implement toggleWishlist(productId)
  - Implement clearWishlist()
  - Add wishlistCount computed value
  - _Requirements: 2.1, 7.1_

---

- [x] 3. Wishlist Button Component

- [x] 3.1 Create WishlistButton component

  - Create `components/ui/WishlistButton.tsx`
  - Define component props interface
  - Set up basic structure with Heart icon
  - Import useWishlist hook
  - _Requirements: 2.1, 6.1_


- [x] 3.2 Implement toggle functionality

  - Add onClick handler
  - Call toggleWishlist from hook
  - Prevent event propagation (e.stopPropagation)
  - Handle loading state
  - _Requirements: 2.1, 6.3_



- [x] 3.3 Add visual states

  - Show outlined heart when not in wishlist
  - Show filled heart when in wishlist
  - Add hover effects (scale, color)
  - Add active/pressed state
  - _Requirements: 2.2, 2.3_


- [x] 3.4 Add tooltip

  - Show "Add to wishlist" when not in wishlist
  - Show "Remove from wishlist" when in wishlist
  - Position tooltip above button
  - _Requirements: 6.2_




- [x] 3.5 Add animations
  - Animate heart fill/unfill
  - Add scale bounce on add
  - Add fade on remove
  - Use framer-motion for smooth animations
  - _Requirements: 2.1_

---



- [x] 4. Integrate WishlistButton into ProductCard


- [ ] 4.1 Update ProductCard component
  - Import WishlistButton component
  - Add WishlistButton to card (top-right corner)
  - Position absolutely over image

  - Ensure z-index is correct

  - _Requirements: 6.1, 6.4, 10.1_

- [ ] 4.2 Style integration
  - Match existing ProductCard hover states
  - Ensure button is visible on hover

  - Add backdrop blur for better visibility

  - Test on light and dark backgrounds
  - _Requirements: 6.1, 10.4_

- [ ] 4.3 Test event handling
  - Verify click doesn't navigate to product page
  - Test on mobile (touch events)
  - Test keyboard navigation
  - Verify accessibility
  - _Requirements: 6.3_

---

- [x] 5. Wishlist Indicator in Header


- [x] 5.1 Create WishlistIndicator component

  - Create `components/ui/WishlistIndicator.tsx`
  - Add Heart icon from lucide-react
  - Import useWishlist hook
  - Add click handler to navigate to /wishlist
  - _Requirements: 1.1, 1.3_


- [x] 5.2 Add count badge

  - Display wishlistCount from hook
  - Show badge only when count > 0
  - Style badge (red background, white text)
  - Position badge on top-right of icon
  - _Requirements: 1.2, 7.1, 7.2, 7.3, 7.4_



- [x] 5.3 Integrate into Header
  - Import WishlistIndicator in Header.tsx
  - Add between Search and Profile icons
  - Match existing icon styling
  - Ensure responsive sizing

  - _Requirements: 1.1, 1.4, 10.1_


- [x] 5.4 Remove old view mode toggle
  - Remove existing view mode icon/button
  - Clean up related code
  - Update header spacing
  - _Requirements: 10.1_

---



- [x] 6. Wishlist Page

- [x] 6.1 Create wishlist page route

  - Create `app/wishlist/page.tsx`
  - Set up basic page structure
  - Add page metadata (title, description)


  - Import useWishlist hook
  - _Requirements: 3.1, 10.2_


- [x] 6.2 Implement product loading
  - Get wishlist product IDs from hook
  - Fetch full product data from database


  - Handle loading state with skeleton
  - Handle errors gracefully
  - _Requirements: 3.1, 3.4_


- [x] 6.3 Create product grid layout
  - Use responsive grid (2-4 columns)

  - Reuse existing ProductCard component
  - Add remove button to each card
  - Ensure proper spacing
  - _Requirements: 3.3, 3.4, 10.2_

- [x] 6.4 Add page header

  - Display "My Wishlist" title
  - Show product count
  - Add "Clear All" button (optional)
  - Style consistently with site

  - _Requirements: 3.1_



- [x] 6.5 Implement remove functionality
  - Add remove button to each product
  - Call removeFromWishlist on click
  - Update grid without page reload

  - Show confirmation toast

  - _Requirements: 8.1, 8.2, 8.3_


- [x] 6.6 Create empty state
  - Design empty state component
  - Show large heart icon
  - Add "Your Wishlist is Empty" message
  - Add "Browse Products" CTA button

  - _Requirements: 3.2, 8.4_


- [x] 6.7 Add loading skeleton

  - Create skeleton for product grid
  - Match ProductCard dimensions
  - Show while loading products
  - _Requirements: 3.1_

---

- [ ] 7. Notifications and Feedback

- [ ] 7.1 Set up toast notification system
  - Install or use existing toast library
  - Create toast utility functions
  - Configure toast positioning and styling
  - _Requirements: 2.4, 2.5_

- [ ] 7.2 Add success notifications
  - Show "Added to wishlist" on add
  - Show "Removed from wishlist" on remove
  - Auto-dismiss after 3 seconds
  - _Requirements: 2.4, 2.5_

- [ ] 7.3 Add error notifications
  - Show error message on failed operations
  - Provide retry option
  - Log errors for debugging
  - _Requirements: 2.4, 2.5_

- [ ] 7.4 Add info notifications
  - Show "Sign in to save across devices" for guests
  - Show on first wishlist add (guest users)
  - Dismiss permanently option
  - _Requirements: 4.1, 5.3_

---

- [ ] 8. Persistence and Sync

- [ ] 8.1 Implement wishlist persistence
  - Save to localStorage on every change (guest)
  - Save to database on every change (auth)
  - Debounce rapid changes
  - _Requirements: 4.1, 4.2, 5.1, 5.4, 9.1, 9.2_

- [ ] 8.2 Implement wishlist restoration
  - Load from localStorage on mount (guest)
  - Load from database on mount (auth)
  - Handle empty wishlist
  - _Requirements: 9.1, 9.2_

- [ ] 8.3 Handle authentication changes
  - Listen for login events
  - Trigger wishlist sync on login
  - Listen for logout events
  - Clear auth wishlist on logout
  - _Requirements: 5.3, 10.3_

- [ ] 8.4 Implement optimistic updates
  - Update UI immediately on add/remove
  - Rollback on database error
  - Show loading indicator during sync
  - _Requirements: 5.4_

---

- [ ] 9. Error Handling and Edge Cases

- [ ] 9.1 Handle database errors
  - Catch and log database errors
  - Fallback to localStorage
  - Show user-friendly error messages
  - Implement retry mechanism
  - _Requirements: 5.1, 5.2_

- [ ] 9.2 Handle localStorage errors
  - Catch quota exceeded errors
  - Limit wishlist to 100 items
  - Show warning when approaching limit
  - _Requirements: 4.1, 4.3_

- [ ] 9.3 Handle product not found
  - Remove invalid product IDs from wishlist
  - Show notification to user
  - Clean up orphaned entries
  - _Requirements: 3.1_

- [ ] 9.4 Handle concurrent modifications
  - Prevent race conditions
  - Use optimistic locking if needed
  - Resolve conflicts gracefully
  - _Requirements: 5.4_

---

- [ ] 10. Testing and Validation

- [ ]* 10.1 Write unit tests for useWishlist hook
  - Test add/remove/toggle operations
  - Test localStorage operations
  - Test database operations
  - Test guest-to-auth migration
  - _Requirements: All_

- [ ]* 10.2 Write component tests
  - Test WishlistButton component
  - Test WishlistIndicator component
  - Test WishlistPage component
  - _Requirements: All_

- [ ]* 10.3 Write integration tests
  - Test guest user flow
  - Test authenticated user flow
  - Test migration flow
  - _Requirements: All_

- [ ] 10.4 Manual testing
  - Test on different browsers
  - Test on mobile devices
  - Test with slow network
  - Test edge cases
  - _Requirements: All_

---

- [ ] 11. Polish and Optimization

- [ ] 11.1 Add animations and transitions
  - Smooth heart fill/unfill
  - Badge slide-in animation
  - Page transitions
  - _Requirements: 2.1_

- [ ] 11.2 Optimize performance
  - Implement debouncing for rapid clicks
  - Cache wishlist in memory
  - Lazy load wishlist products
  - _Requirements: 5.4_

- [ ] 11.3 Improve accessibility
  - Add ARIA labels
  - Test keyboard navigation
  - Test with screen readers
  - Ensure focus management
  - _Requirements: 6.1, 6.2_

- [ ] 11.4 Add loading states
  - Show skeleton on wishlist page
  - Show spinner on button during operation
  - Disable button during loading
  - _Requirements: 3.1_

---

- [ ] 12. Documentation

- [ ]* 12.1 Write user documentation
  - How to add products to wishlist
  - How to view wishlist
  - How to remove products
  - Guest vs authenticated differences
  - _Requirements: All_

- [ ]* 12.2 Write developer documentation
  - Document useWishlist hook API
  - Document component props
  - Document database schema
  - Add code examples
  - _Requirements: All_

- [ ]* 12.3 Update README
  - Add wishlist feature to feature list
  - Document environment variables (if any)
  - Add screenshots
  - _Requirements: All_

---

## Implementation Notes

### Order of Implementation

1. Start with database setup (Task 1)
2. Build core hook (Task 2)
3. Create UI components (Tasks 3-5)
4. Build wishlist page (Task 6)
5. Add polish (Tasks 7-11)
6. Test and document (Tasks 10, 12)

### Testing Strategy

- Test each task independently before moving to next
- Use manual testing for UI components
- Write automated tests for core logic
- Test on multiple devices and browsers

### Dependencies

- Supabase client (already installed)
- lucide-react icons (already installed)
- framer-motion (already installed)
- Toast library (check if exists, or use simple implementation)

### Estimated Time

- Database setup: 1 hour
- Core hook: 3-4 hours
- UI components: 3-4 hours
- Wishlist page: 2-3 hours
- Polish and testing: 2-3 hours
- **Total: 11-15 hours**

### Success Criteria

- ✅ Users can add/remove products from wishlist
- ✅ Wishlist persists across sessions
- ✅ Guest wishlist migrates to database on login
- ✅ Wishlist page displays all saved products
- ✅ Count badge shows correct number
- ✅ All interactions are smooth and responsive
- ✅ No console errors or warnings
- ✅ Accessible via keyboard and screen readers
