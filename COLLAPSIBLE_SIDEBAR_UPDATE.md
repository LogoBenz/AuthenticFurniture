# Collapsible Sidebar with Hover-to-Expand

## Changes Made

### 1. Default State
- Sidebar now starts **collapsed by default** (showing only icons)
- Width when collapsed: **80px (20 Tailwind units)**
- Width when expanded: **320px (80 Tailwind units)**

### 2. Hover Functionality
- When sidebar is collapsed, hovering over it **automatically expands** it
- Smooth 300ms transition with ease-in-out timing
- Shadow effect added when hovering for better visual feedback
- All text, labels, and descriptions appear on hover

### 3. Visual Improvements

#### Collapsed State (Icon-Only):
- Icons are centered in a 48px × 48px button
- Larger icons (24px) for better visibility
- Tooltip shows full menu item name on hover
- Toggle button centered at the top
- Minimal padding for compact design

#### Expanded State (Full Width):
- Full menu with titles and descriptions
- Category headers visible
- Toggle button on the right side
- Standard padding and spacing

#### Hover State (Collapsed → Temporarily Expanded):
- Sidebar expands to full width
- Shadow-xl effect for depth
- Thicker border for emphasis
- All content becomes visible
- Collapses back when mouse leaves

### 4. Toggle Button
- Always visible (centered when collapsed, right-aligned when expanded)
- Tooltip added: "Expand sidebar" / "Collapse sidebar"
- Better hover effect with background color change
- Chevron icon indicates current state

### 5. Responsive Behavior
- **Desktop (lg+)**: Collapsible sidebar with hover-to-expand
- **Mobile**: Full overlay sidebar (not affected by collapse state)
- Main content adjusts padding based on sidebar state

## How to Use

1. **Collapse/Expand**: Click the chevron button at the top of the sidebar
2. **Quick Peek**: When collapsed, hover over the sidebar to see full menu
3. **Navigate**: Click any icon (collapsed) or menu item (expanded) to navigate

## Technical Details

### Files Modified:
- `components/admin/AdminSidebar.tsx` - Main sidebar component with hover logic
- `components/admin/AdminSidebarContext.tsx` - Default state changed to collapsed
- `components/admin/AdminMainContent.tsx` - Updated padding for collapsed state

### Key Features:
- `isHovered` state tracks mouse hover
- `showExpanded` computed value determines when to show full content
- `onMouseEnter` and `onMouseLeave` handlers manage hover state
- Smooth CSS transitions for all state changes
- Maintains all existing functionality (mobile menu, active states, etc.)
