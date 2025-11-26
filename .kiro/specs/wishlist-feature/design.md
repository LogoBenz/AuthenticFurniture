# Wishlist/Favorites Feature - Design Document

## Overview

The wishlist feature allows users to save products for later viewing. It supports both guest users (localStorage) and authenticated users (database persistence). The feature integrates seamlessly with existing components and follows the current design system.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     User Interface Layer                     │
├─────────────────────────────────────────────────────────────┤
│  Header (Heart Icon) │ ProductCard │ Wishlist Page          │
└──────────────┬──────────────────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────────────────┐
│                   Wishlist Hook Layer                        │
├─────────────────────────────────────────────────────────────┤
│  useWishlist() - State Management & Business Logic          │
└──────────────┬──────────────────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────────────────┐
│                   Storage Layer                              │
├─────────────────────────────────────────────────────────────┤
│  Guest: localStorage  │  Auth: Supabase Database            │
└─────────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
App
├── Header
│   └── WishlistIndicator (Heart Icon + Badge)
├── ProductCard
│   └── WishlistButton (Heart Icon)
└── WishlistPage
    ├── WishlistGrid
    │   └── ProductCard (reused)
    └── EmptyWishlistState
```

## Components and Interfaces

### 1. useWishlist Hook

**Purpose:** Central state management for wishlist functionality

**Interface:**
```typescript
interface UseWishlistReturn {
  wishlist: string[];                    // Array of product IDs
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  wishlistCount: number;
  loading: boolean;
}
```

**Responsibilities:**
- Manage wishlist state
- Handle localStorage for guest users
- Handle database operations for authenticated users
- Sync guest wishlist to database on login
- Provide wishlist operations (add, remove, toggle)

### 2. WishlistIndicator Component

**Purpose:** Display wishlist icon with count badge in header

**Props:**
```typescript
interface WishlistIndicatorProps {
  className?: string;
}
```

**Features:**
- Heart icon (lucide-react)
- Count badge (only shown when count > 0)
- Click navigates to /wishlist
- Responsive sizing

### 3. WishlistButton Component

**Purpose:** Heart button on product cards

**Props:**
```typescript
interface WishlistButtonProps {
  productId: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
```

**Features:**
- Filled heart when in wishlist
- Outlined heart when not in wishlist
- Click prevents event propagation
- Hover tooltip
- Loading state during operation

### 4. WishlistPage Component

**Purpose:** Display all wishlist products

**Features:**
- Grid layout (responsive: 2-4 columns)
- Empty state with CTA
- Remove button on each product
- Loading skeleton
- Product count display

## Data Models

### Database Schema

**Table: `wishlists`**
```sql
CREATE TABLE wishlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

CREATE INDEX idx_wishlists_user_id ON wishlists(user_id);
CREATE INDEX idx_wishlists_product_id ON wishlists(product_id);
```

**RLS Policies:**
```sql
-- Users can only read their own wishlist
CREATE POLICY "Users can view own wishlist"
  ON wishlists FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert to their own wishlist
CREATE POLICY "Users can add to own wishlist"
  ON wishlists FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only delete from their own wishlist
CREATE POLICY "Users can remove from own wishlist"
  ON wishlists FOR DELETE
  USING (auth.uid() = user_id);
```

### localStorage Schema

**Key:** `guest_wishlist`

**Value:**
```typescript
{
  productIds: string[];
  lastUpdated: string; // ISO timestamp
}
```

## Error Handling

### Error Scenarios

1. **Database Connection Error**
   - Fallback to localStorage
   - Show error toast
   - Retry mechanism

2. **Authentication Error**
   - Clear authenticated state
   - Switch to guest mode
   - Preserve current wishlist in localStorage

3. **Product Not Found**
   - Remove from wishlist
   - Show notification

4. **localStorage Full**
   - Show warning
   - Limit to 100 items

### Error Messages

```typescript
const ERROR_MESSAGES = {
  ADD_FAILED: "Couldn't add to wishlist. Please try again.",
  REMOVE_FAILED: "Couldn't remove from wishlist. Please try again.",
  LOAD_FAILED: "Couldn't load your wishlist. Please refresh.",
  SYNC_FAILED: "Couldn't sync your wishlist. Changes saved locally.",
  STORAGE_FULL: "Wishlist is full. Remove items to add more."
};
```

## Testing Strategy

### Unit Tests

1. **useWishlist Hook**
   - Add/remove/toggle operations
   - localStorage operations
   - Database operations
   - Guest to auth migration

2. **WishlistButton Component**
   - Click handling
   - Visual states
   - Event propagation

3. **WishlistIndicator Component**
   - Count display
   - Navigation
   - Badge visibility

### Integration Tests

1. **Guest User Flow**
   - Add products to wishlist
   - Persist across page refresh
   - View wishlist page

2. **Authenticated User Flow**
   - Add products to wishlist
   - Sync to database
   - Load from database on login

3. **Migration Flow**
   - Guest adds products
   - User logs in
   - Wishlist merges correctly

### E2E Tests

1. Complete user journey
2. Cross-device persistence
3. Concurrent modifications

## Performance Considerations

### Optimization Strategies

1. **Debouncing**
   - Debounce rapid add/remove operations
   - Batch database updates

2. **Caching**
   - Cache wishlist in memory
   - Invalidate on mutations

3. **Lazy Loading**
   - Load wishlist products on demand
   - Paginate wishlist page if > 50 items

4. **Optimistic Updates**
   - Update UI immediately
   - Rollback on error

### Performance Targets

- Add/Remove operation: < 100ms (UI response)
- Database sync: < 500ms
- Wishlist page load: < 1s
- localStorage operations: < 10ms

## Security Considerations

### Data Protection

1. **RLS Policies**
   - Users can only access their own wishlist
   - No public read access

2. **Input Validation**
   - Validate product IDs
   - Sanitize user input
   - Limit wishlist size

3. **Rate Limiting**
   - Limit add/remove operations
   - Prevent spam

### Privacy

1. **Guest Data**
   - localStorage only
   - No server tracking
   - Clear on logout

2. **Authenticated Data**
   - Encrypted in transit
   - Secure database storage
   - User can delete all data

## UI/UX Design

### Visual Design

**Heart Icon States:**
- Outlined: Not in wishlist (stroke-2)
- Filled: In wishlist (fill-current)
- Hover: Scale 1.1, color transition
- Active: Scale 0.95

**Colors:**
- Default: text-slate-600
- Active: text-red-500
- Hover: text-red-400

**Animations:**
- Add: Heart fills with scale bounce
- Remove: Heart empties with fade
- Count badge: Slide in from right

### Empty State

```
┌─────────────────────────────────────┐
│                                     │
│           ♡ (Large Icon)            │
│                                     │
│      Your Wishlist is Empty         │
│                                     │
│   Save products you love to view    │
│          them later                 │
│                                     │
│     [Browse Products Button]        │
│                                     │
└─────────────────────────────────────┘
```

### Notifications

**Success:**
- "Added to wishlist ✓"
- "Removed from wishlist"

**Error:**
- "Couldn't add to wishlist. Try again."
- "Couldn't remove from wishlist. Try again."

**Info:**
- "Sign in to save wishlist across devices"

## Integration Points

### Existing Components

1. **Header.tsx**
   - Add WishlistIndicator between Search and Profile icons
   - Remove existing view mode toggle

2. **ProductCard.tsx**
   - Add WishlistButton to top-right corner
   - Integrate with existing hover states

3. **Authentication**
   - Hook into login/logout events
   - Trigger wishlist sync on login

4. **Routing**
   - Add /wishlist route
   - Add /wishlist page component

### API Endpoints

No new API endpoints needed - use Supabase client directly:
- `supabase.from('wishlists').select()`
- `supabase.from('wishlists').insert()`
- `supabase.from('wishlists').delete()`

## Migration Strategy

### Phase 1: Core Implementation
- Create database table
- Implement useWishlist hook
- Add WishlistButton to ProductCard

### Phase 2: UI Integration
- Add WishlistIndicator to Header
- Create WishlistPage
- Add empty state

### Phase 3: Polish
- Add animations
- Add notifications
- Optimize performance

### Phase 4: Testing
- Unit tests
- Integration tests
- User acceptance testing

## Accessibility

### ARIA Labels

```typescript
<button aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}>
  <Heart />
</button>

<div role="status" aria-live="polite">
  {wishlistCount} items in wishlist
</div>
```

### Keyboard Navigation

- Tab to wishlist button
- Enter/Space to toggle
- Focus visible states

### Screen Reader Support

- Announce wishlist changes
- Describe icon states
- Provide context for counts

## Future Enhancements

1. **Wishlist Sharing**
   - Generate shareable links
   - Social media integration

2. **Wishlist Collections**
   - Multiple wishlists
   - Named collections

3. **Price Alerts**
   - Notify on price drops
   - Email notifications

4. **Stock Alerts**
   - Notify when back in stock
   - Low stock warnings

5. **Analytics**
   - Track popular wishlist items
   - Conversion tracking
