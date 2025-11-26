# Testing Quick Reference Guide

## Quick Start

```bash
# Run automated visual regression tests
npm run test:visual-regression

# View Core Web Vitals testing guide
npm run test:core-web-vitals
```

## Test Files Location

- **Automated Tests:** `scripts/test-visual-regression.js`
- **Core Web Vitals Guide:** `scripts/test-core-web-vitals.js`
- **Cross-Browser Checklist:** `.kiro/specs/product-details-redesign/cross-browser-testing-guide.md`
- **Test Results:** `.kiro/specs/product-details-redesign/test-results.md`

## What Gets Tested

### Automated Tests (71 tests)
1. ✅ Page load verification
2. ✅ Desktop layout (1920x1080)
3. ✅ Tablet layout (768x1024)
4. ✅ Mobile layout (375x667)
5. ✅ Component styling (badges, buttons, icons)
6. ✅ Hover states
7. ✅ Color contrast (WCAG AA)
8. ✅ Core Web Vitals optimization
9. ✅ Typography and spacing
10. ✅ Accessibility features

### Manual Testing Required
1. ⚠️ Real browser testing (Chrome, Firefox, Safari, Edge)
2. ⚠️ Real device testing (phones, tablets)
3. ⚠️ Lighthouse performance audits
4. ⚠️ Screen reader testing
5. ⚠️ Keyboard navigation

## Key Metrics to Verify

### Desktop (1920x1080)
- **Layout:** 60/40 grid split
- **LCP:** < 1.5s
- **CLS:** < 0.05
- **FID:** < 50ms

### Mobile (375x667)
- **Layout:** Vertical stacking
- **LCP:** < 2.5s
- **CLS:** < 0.1
- **FID:** < 100ms

### Color Contrast
- **All text:** ≥ 4.5:1 ratio (WCAG AA)

## Component Checklist

### Popular Badge
- [ ] Width: auto, max-w-[180px]
- [ ] Height: h-8 (32px)
- [ ] Style: rounded-full, bg-gray-100
- [ ] Hover: hover:bg-gray-200

### Image Gallery
- [ ] Thumbnails: w-24 h-24, space-y-3
- [ ] Active: border-2 border-blue-800
- [ ] Hover: scale-[1.02]

### Buttons
- [ ] Height: h-12 (48px)
- [ ] Primary: bg-blue-800
- [ ] Secondary: border-2 border-gray-300

### Icons
- [ ] Payment: w-4 h-4 (Check icons)
- [ ] Social: w-5 h-5 (monochrome)
- [ ] Features: w-4 h-4 (Check icons)

## Browser Testing Matrix

| Browser | Desktop | Tablet | Mobile | Status |
|---------|---------|--------|--------|--------|
| Chrome  | ✓       | ✓      | ✓      | Required |
| Firefox | ✓       | -      | -      | Required |
| Safari  | ✓       | ✓      | ✓      | Required |
| Edge    | ✓       | -      | -      | Required |

## Lighthouse Testing

1. Open Chrome DevTools (F12)
2. Go to "Lighthouse" tab
3. Select "Performance"
4. Choose device type
5. Click "Analyze page load"
6. Verify scores:
   - Performance: > 90 (desktop), > 80 (mobile)
   - Accessibility: > 95
   - Best Practices: > 90
   - SEO: > 90

## Common Issues to Check

### Layout
- [ ] No horizontal scrolling on mobile
- [ ] Content doesn't overflow containers
- [ ] Grid splits correctly at breakpoints

### Images
- [ ] All images load correctly
- [ ] Thumbnails are clickable
- [ ] Main image zooms on hover
- [ ] No layout shift during load

### Interactions
- [ ] All buttons are clickable
- [ ] Hover states work correctly
- [ ] Touch targets are adequate (44x44px)
- [ ] Keyboard navigation works

### Typography
- [ ] Text is readable at all sizes
- [ ] Font weights are consistent
- [ ] Line heights are appropriate
- [ ] No text overflow

### Colors
- [ ] Contrast ratios meet WCAG AA
- [ ] Brand colors used consistently
- [ ] Hover states are visible

## Quick Fixes

### If LCP is slow:
```tsx
// Add priority to main image
<Image priority src={...} />
```

### If CLS is high:
```tsx
// Add dimensions to images
<Image width={600} height={600} />
```

### If hover doesn't work:
```tsx
// Use transition classes
className="hover:bg-gray-200 transition-colors duration-200"
```

### If contrast fails:
```tsx
// Use darker text colors
text-gray-900 instead of text-gray-600
```

## Test Product Recommendations

Use products with:
- ✓ Multiple images (5+)
- ✓ Complete specifications
- ✓ All features populated
- ✓ Popular badge data
- ✓ Pricing information

Example slugs:
- `executive-office-chair`
- `modern-office-desk`
- `ergonomic-task-chair`

## Reporting Issues

Include in bug reports:
1. Browser and version
2. Viewport size
3. Screenshot/video
4. Steps to reproduce
5. Expected vs actual behavior
6. Console errors

## Success Criteria

✅ All automated tests pass (70/71)  
✅ Manual browser tests complete  
✅ Lighthouse scores meet targets  
✅ Accessibility audit passes  
✅ No visual regressions  
✅ Performance metrics in "Good" range

## Next Steps After Testing

1. Review test results document
2. Address any issues found
3. Re-test after fixes
4. Get stakeholder approval
5. Deploy to production

## Support

- **Test Scripts:** `scripts/test-*.js`
- **Documentation:** `.kiro/specs/product-details-redesign/`
- **Requirements:** `requirements.md`
- **Design:** `design.md`

---

**Quick Tip:** Run `npm run test:visual-regression` first to catch most issues automatically before manual testing.
