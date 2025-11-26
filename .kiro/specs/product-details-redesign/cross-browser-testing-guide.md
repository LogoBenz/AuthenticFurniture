# Cross-Browser Testing Guide

## Overview

This document provides a comprehensive checklist for manually testing the redesigned product details page across different browsers and devices. Use this guide to ensure consistent behavior and appearance across all target platforms.

## Test Product

Use a product with complete data for testing:
- **Recommended Slug**: `executive-office-chair` or any product with multiple images, features, and complete specifications

## Desktop Testing (1920x1080)

### Chrome (Latest)

**Layout Verification:**
- [ ] Page loads without errors
- [ ] 60/40 grid split displays correctly (image gallery 60%, product info 40%)
- [ ] Top padding is pt-16 (reduced from pt-24)
- [ ] Grid gap is gap-6 lg:gap-10
- [ ] Popular badge appears at top of product info section

**Image Gallery:**
- [ ] Thumbnails are w-24 h-24 (96px)
- [ ] Thumbnail spacing is space-y-3 (12px)
- [ ] Active thumbnail has border-2 border-blue-800
- [ ] Inactive thumbnails have border border-gray-200
- [ ] Main image hover shows scale-[1.02] effect
- [ ] Navigation arrows appear on hover with bg-white/95

**Product Info:**
- [ ] Title uses text-3xl lg:text-4xl font-bold
- [ ] Pricing displays correctly with proper styling
- [ ] Add to Cart button: bg-blue-800 hover:bg-blue-900
- [ ] WhatsApp button: border-2 border-gray-300 hover:bg-gray-50
- [ ] Button height is h-12 (48px)
- [ ] Info row (shipping, delivery, warranty) has no colored backgrounds
- [ ] Icons are text-blue-800 and w-5 h-5

**Payment Methods:**
- [ ] Checkmark icons replace colored dots
- [ ] Background is bg-gray-50
- [ ] Grid layout: grid-cols-1 sm:grid-cols-3
- [ ] Icons are w-4 h-4 text-gray-700

**Social Share:**
- [ ] Icons are monochrome (text-gray-600)
- [ ] Hover shows text-blue-800 and scale-110
- [ ] Buttons are w-10 h-10 with border-gray-300
- [ ] Spacing is space-x-2

**Key Features:**
- [ ] Checkmark icons replace colored bullets
- [ ] Two-column layout: grid-cols-1 md:grid-cols-2
- [ ] Icons are w-4 h-4 text-gray-700
- [ ] Spacing is gap-3

**Tabs:**
- [ ] Active tab: border-b-2 border-blue-800
- [ ] Inactive tabs: border-transparent text-gray-600
- [ ] Tab spacing: space-x-8
- [ ] Content padding: py-8
- [ ] Typography uses text-sm with leading-relaxed

**Hover States:**
- [ ] Popular badge: hover:bg-gray-200
- [ ] Thumbnails: hover:border-gray-300
- [ ] Main image: hover:scale-[1.02]
- [ ] Primary button: hover:bg-blue-900
- [ ] Secondary button: hover:bg-gray-50
- [ ] Social icons: hover:text-blue-800 hover:scale-110
- [ ] Tabs: hover:text-gray-900

### Firefox (Latest)

Repeat all Chrome tests above, paying special attention to:
- [ ] CSS Grid layout renders identically
- [ ] Border radius (rounded-full, rounded-lg) displays correctly
- [ ] Hover transitions are smooth (duration-200)
- [ ] Image optimization works correctly
- [ ] Font rendering is consistent

### Safari (Latest)

Repeat all Chrome tests above, paying special attention to:
- [ ] Webkit-specific CSS properties work
- [ ] Backdrop filters (bg-white/95) render correctly
- [ ] Smooth scrolling works on thumbnail strip
- [ ] Touch events work on trackpad
- [ ] Font smoothing is appropriate

### Edge (Latest)

Repeat all Chrome tests above, paying special attention to:
- [ ] Chromium-based rendering is consistent
- [ ] No Edge-specific layout issues
- [ ] Performance is comparable to Chrome

## Tablet Testing (768x1024)

### Chrome on Tablet

**Responsive Behavior:**
- [ ] Grid switches to single column at appropriate breakpoint
- [ ] Image gallery maintains usability
- [ ] Thumbnails remain accessible
- [ ] Button sizing maintains h-12 for touch targets
- [ ] Text remains readable
- [ ] Spacing adjusts appropriately

**Touch Interactions:**
- [ ] All buttons are at least 44x44px
- [ ] Tap targets don't overlap
- [ ] Hover states work with touch (tap to activate)
- [ ] Scrolling is smooth
- [ ] Image gallery swipe works

### Safari on iPad

Repeat tablet Chrome tests above, paying special attention to:
- [ ] iOS-specific touch behaviors
- [ ] Momentum scrolling works correctly
- [ ] Pinch-to-zoom is disabled where appropriate
- [ ] Font sizes are appropriate for iPad
- [ ] Layout doesn't break on orientation change

## Mobile Testing (375x667)

### Chrome Mobile

**Layout Verification:**
- [ ] All content stacks vertically (grid-cols-1)
- [ ] Top padding is appropriate
- [ ] Margins maintain balance
- [ ] No horizontal scrolling (except thumbnails)

**Image Gallery:**
- [ ] Thumbnails collapse to horizontal scroll
- [ ] Thumbnail size: w-20 h-20
- [ ] Spacing: space-x-2
- [ ] Scroll behavior: overflow-x-auto scrollbar-hide
- [ ] Main image displays at appropriate size

**Product Info:**
- [ ] Title is readable (responsive sizing)
- [ ] Pricing is prominent
- [ ] Buttons stack vertically or in grid
- [ ] All buttons are h-12 (48px) minimum
- [ ] Touch targets are adequate

**Payment Methods:**
- [ ] Grid adjusts to single column if needed
- [ ] Icons and text remain readable
- [ ] Spacing is appropriate

**Social Share:**
- [ ] Icons remain accessible
- [ ] Buttons maintain w-10 h-10 size
- [ ] Spacing doesn't cause wrapping issues

**Key Features:**
- [ ] Features stack to single column
- [ ] Icons and text align properly
- [ ] Spacing is comfortable

**Tabs:**
- [ ] Tab navigation is scrollable if needed
- [ ] Active tab indicator is visible
- [ ] Content is readable
- [ ] Spacing is appropriate for mobile

**Touch Interactions:**
- [ ] All interactive elements are at least 44x44px
- [ ] Tap targets don't overlap
- [ ] Scrolling is smooth
- [ ] No accidental taps on adjacent elements

### Safari iOS

Repeat mobile Chrome tests above, paying special attention to:
- [ ] iOS-specific rendering
- [ ] Safe area insets respected
- [ ] Momentum scrolling works
- [ ] Font rendering is crisp
- [ ] No layout shifts on scroll
- [ ] Orientation change handled gracefully

## Color Contrast Testing (WCAG AA)

Use a contrast checker tool (e.g., WebAIM Contrast Checker) to verify:

- [ ] Primary text (gray-900) on white: ≥ 4.5:1
- [ ] Secondary text (gray-600) on white: ≥ 4.5:1
- [ ] Brand blue (#1E40AF) on white: ≥ 4.5:1
- [ ] White text on brand blue: ≥ 4.5:1
- [ ] Gray-700 text on gray-50: ≥ 4.5:1
- [ ] Button text contrast: ≥ 4.5:1
- [ ] Link text contrast: ≥ 4.5:1

## Core Web Vitals Testing

Use Chrome DevTools Lighthouse or PageSpeed Insights:

### Largest Contentful Paint (LCP)
- [ ] LCP < 2.5 seconds (Good)
- [ ] Main product image loads quickly
- [ ] Priority prop used on main image
- [ ] Image optimization working

### Cumulative Layout Shift (CLS)
- [ ] CLS < 0.1 (Good)
- [ ] No layout shifts during load
- [ ] Image dimensions reserved
- [ ] Font loading doesn't cause shifts

### First Input Delay (FID) / Interaction to Next Paint (INP)
- [ ] FID < 100ms (Good)
- [ ] Buttons respond immediately
- [ ] No JavaScript blocking main thread
- [ ] Animations use CSS transforms

### Additional Metrics
- [ ] First Contentful Paint (FCP) < 1.8s
- [ ] Time to Interactive (TTI) < 3.8s
- [ ] Total Blocking Time (TBT) < 200ms

## Performance Testing

### Network Throttling
Test with Chrome DevTools throttling:

**Fast 3G:**
- [ ] Page loads within acceptable time
- [ ] Images load progressively
- [ ] Layout doesn't break during load

**Slow 3G:**
- [ ] Critical content loads first
- [ ] Loading states are visible
- [ ] No timeout errors

### Cache Testing
- [ ] First visit loads all resources
- [ ] Subsequent visits use cached resources
- [ ] Images are cached appropriately

## Accessibility Testing

### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Focus indicators are visible
- [ ] Tab order is logical
- [ ] Enter/Space activates buttons
- [ ] Escape closes modals/overlays

### Screen Reader Testing
Use NVDA (Windows) or VoiceOver (Mac):
- [ ] Page title is announced
- [ ] Headings are announced correctly
- [ ] Buttons have descriptive labels
- [ ] Images have alt text
- [ ] Form inputs have labels
- [ ] Links are descriptive

### Visual Accessibility
- [ ] Text is readable at 200% zoom
- [ ] No information conveyed by color alone
- [ ] Focus indicators are visible
- [ ] Sufficient spacing between interactive elements

## Browser-Specific Issues to Watch For

### Chrome
- Common issues: None expected
- Watch for: Grid layout edge cases

### Firefox
- Common issues: Subtle font rendering differences
- Watch for: Border radius rendering, backdrop filters

### Safari
- Common issues: Webkit-specific CSS, font smoothing
- Watch for: Backdrop filters, smooth scrolling, touch events

### Edge
- Common issues: None expected (Chromium-based)
- Watch for: Legacy Edge users (if supporting)

## Testing Checklist Summary

- [ ] Desktop Chrome (1920x1080) - All tests passed
- [ ] Desktop Firefox (1920x1080) - All tests passed
- [ ] Desktop Safari (1920x1080) - All tests passed
- [ ] Desktop Edge (1920x1080) - All tests passed
- [ ] Tablet Chrome (768x1024) - All tests passed
- [ ] Tablet Safari (768x1024) - All tests passed
- [ ] Mobile Chrome (375x667) - All tests passed
- [ ] Mobile Safari iOS (375x667) - All tests passed
- [ ] Color contrast WCAG AA - All ratios ≥ 4.5:1
- [ ] Core Web Vitals - All metrics in "Good" range
- [ ] Keyboard navigation - Fully accessible
- [ ] Screen reader - Properly announced

## Reporting Issues

When reporting issues, include:
1. Browser and version
2. Viewport size
3. Screenshot or video
4. Steps to reproduce
5. Expected vs actual behavior
6. Console errors (if any)

## Sign-off

**Tester Name:** ___________________________

**Date:** ___________________________

**Overall Status:** [ ] PASS [ ] FAIL [ ] NEEDS REVIEW

**Notes:**
_______________________________________________
_______________________________________________
_______________________________________________
