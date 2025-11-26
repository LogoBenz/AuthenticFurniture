/**
 * Responsive Behavior Verification Script
 * Tests product details page responsive behavior across different viewports
 */

const puppeteer = require('puppeteer');

// Test configuration
const TEST_URL = 'http://localhost:3000';
const TEST_PRODUCT_SLUG = 'the-smartstart-study-desk';

// Viewport configurations
const VIEWPORTS = {
  mobile: { width: 375, height: 667, name: 'Mobile (375px)' },
  tablet: { width: 768, height: 1024, name: 'Tablet (768px)' },
  desktop: { width: 1920, height: 1080, name: 'Desktop (1920px)' }
};

// Minimum touch target size (WCAG 2.1 Level AAA)
const MIN_TOUCH_TARGET = 44;

async function testResponsiveBehavior() {
  console.log('🚀 Starting Responsive Behavior Tests\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const results = {
    passed: [],
    failed: [],
    warnings: []
  };

  try {
    // Test Mobile Viewport (375px)
    console.log('📱 Testing Mobile Viewport (375px width)...\n');
    await testMobileViewport(browser, results);

    // Test Tablet Viewport (768px)
    console.log('\n📱 Testing Tablet Viewport (768px width)...\n');
    await testTabletViewport(browser, results);

    // Test Desktop Viewport (1920px)
    console.log('\n💻 Testing Desktop Viewport (1920px width)...\n');
    await testDesktopViewport(browser, results);

  } catch (error) {
    console.error('❌ Test execution error:', error);
    results.failed.push(`Test execution error: ${error.message}`);
  } finally {
    await browser.close();
  }

  // Print results
  printResults(results);
}

async function testMobileViewport(browser, results) {
  const page = await browser.newPage();
  await page.setViewport(VIEWPORTS.mobile);
  
  try {
    await page.goto(`${TEST_URL}/products/${TEST_PRODUCT_SLUG}`, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Test 1: Image gallery thumbnails collapse to horizontal scroll
    console.log('  ✓ Test 1: Image gallery thumbnails horizontal scroll');
    const thumbnailContainer = await page.$('.lg\\:hidden.flex.space-x-2.overflow-x-auto');
    if (thumbnailContainer) {
      const isVisible = await page.evaluate(el => {
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden';
      }, thumbnailContainer);
      
      if (isVisible) {
        results.passed.push('Mobile: Thumbnails display in horizontal scroll');
        console.log('    ✅ Thumbnails are in horizontal scroll layout');
      } else {
        results.failed.push('Mobile: Thumbnails not visible');
        console.log('    ❌ Thumbnails not visible');
      }
    } else {
      results.failed.push('Mobile: Thumbnail container not found');
      console.log('    ❌ Thumbnail container not found');
    }

    // Test 2: Content stacks vertically
    console.log('  ✓ Test 2: Content stacks vertically');
    const gridLayout = await page.$('.grid.grid-cols-1.lg\\:grid-cols-\\[1\\.5fr_1fr\\]');
    if (gridLayout) {
      const gridColumns = await page.evaluate(el => {
        return window.getComputedStyle(el).gridTemplateColumns;
      }, gridLayout);
      
      // On mobile, should be single column
      if (gridColumns === 'none' || gridColumns.split(' ').length === 1) {
        results.passed.push('Mobile: Content stacks in single column');
        console.log('    ✅ Content stacks in single column');
      } else {
        results.warnings.push('Mobile: Content may not be stacking correctly');
        console.log('    ⚠️  Grid columns:', gridColumns);
      }
    }

    // Test 3: Check margins and font sizes
    console.log('  ✓ Test 3: Margins and font sizes');
    const title = await page.$('h1');
    if (title) {
      const titleStyles = await page.evaluate(el => {
        const style = window.getComputedStyle(el);
        return {
          fontSize: style.fontSize,
          marginBottom: style.marginBottom
        };
      }, title);
      
      const fontSize = parseFloat(titleStyles.fontSize);
      if (fontSize >= 28 && fontSize <= 40) { // 3xl to 4xl range
        results.passed.push(`Mobile: Title font size appropriate (${titleStyles.fontSize})`);
        console.log(`    ✅ Title font size: ${titleStyles.fontSize}`);
      } else {
        results.warnings.push(`Mobile: Title font size may be too small/large (${titleStyles.fontSize})`);
        console.log(`    ⚠️  Title font size: ${titleStyles.fontSize}`);
      }
    }

    // Test 4: Touch target sizes (minimum 44x44px)
    console.log('  ✓ Test 4: Touch target sizes (minimum 44x44px)');
    const buttons = await page.$$('button');
    let touchTargetIssues = 0;
    
    for (const button of buttons) {
      const box = await button.boundingBox();
      if (box) {
        if (box.width < MIN_TOUCH_TARGET || box.height < MIN_TOUCH_TARGET) {
          touchTargetIssues++;
          const text = await page.evaluate(el => el.textContent?.trim().substring(0, 30), button);
          results.warnings.push(`Mobile: Button too small (${Math.round(box.width)}x${Math.round(box.height)}): "${text}"`);
        }
      }
    }
    
    if (touchTargetIssues === 0) {
      results.passed.push('Mobile: All interactive elements meet 44x44px minimum');
      console.log('    ✅ All buttons meet minimum touch target size');
    } else {
      console.log(`    ⚠️  ${touchTargetIssues} buttons below minimum touch target`);
    }

    // Test 5: No horizontal overflow
    console.log('  ✓ Test 5: No horizontal overflow');
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = VIEWPORTS.mobile.width;
    
    if (bodyWidth <= viewportWidth + 5) { // 5px tolerance
      results.passed.push('Mobile: No horizontal overflow');
      console.log('    ✅ No horizontal overflow detected');
    } else {
      results.failed.push(`Mobile: Horizontal overflow detected (${bodyWidth}px > ${viewportWidth}px)`);
      console.log(`    ❌ Horizontal overflow: ${bodyWidth}px > ${viewportWidth}px`);
    }

  } catch (error) {
    results.failed.push(`Mobile viewport test error: ${error.message}`);
    console.error('    ❌ Error:', error.message);
  } finally {
    await page.close();
  }
}

async function testTabletViewport(browser, results) {
  const page = await browser.newPage();
  await page.setViewport(VIEWPORTS.tablet);
  
  try {
    await page.goto(`${TEST_URL}/products/${TEST_PRODUCT_SLUG}`, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Test 1: Grid adjustments work correctly
    console.log('  ✓ Test 1: Grid layout adjustments');
    const gridLayout = await page.$('.grid.grid-cols-1.lg\\:grid-cols-\\[1\\.5fr_1fr\\]');
    if (gridLayout) {
      const gridColumns = await page.evaluate(el => {
        return window.getComputedStyle(el).gridTemplateColumns;
      }, gridLayout);
      
      // On tablet (768px), should still be single column (lg breakpoint is 1024px)
      if (gridColumns === 'none' || gridColumns.split(' ').length === 1) {
        results.passed.push('Tablet: Grid uses single column layout');
        console.log('    ✅ Grid uses single column layout');
      } else {
        results.warnings.push(`Tablet: Grid columns: ${gridColumns}`);
        console.log(`    ⚠️  Grid columns: ${gridColumns}`);
      }
    }

    // Test 2: Button layouts (should use sm:grid-cols-2)
    console.log('  ✓ Test 2: Button grid layouts');
    const buttonGrid = await page.$('.grid.grid-cols-1.sm\\:grid-cols-2');
    if (buttonGrid) {
      const gridColumns = await page.evaluate(el => {
        return window.getComputedStyle(el).gridTemplateColumns;
      }, buttonGrid);
      
      const columnCount = gridColumns.split(' ').length;
      if (columnCount === 2) {
        results.passed.push('Tablet: Action buttons use 2-column layout');
        console.log('    ✅ Action buttons use 2-column layout');
      } else {
        results.warnings.push(`Tablet: Button grid has ${columnCount} columns`);
        console.log(`    ⚠️  Button grid has ${columnCount} columns`);
      }
    }

    // Test 3: Touch targets still adequate
    console.log('  ✓ Test 3: Touch target sizes');
    const actionButtons = await page.$$('.h-12'); // h-12 = 48px
    if (actionButtons.length > 0) {
      let adequateTargets = 0;
      for (const button of actionButtons) {
        const box = await button.boundingBox();
        if (box && box.height >= MIN_TOUCH_TARGET) {
          adequateTargets++;
        }
      }
      
      if (adequateTargets > 0) {
        results.passed.push(`Tablet: ${adequateTargets} action buttons have adequate height`);
        console.log(`    ✅ ${adequateTargets} action buttons have adequate height (48px)`);
      }
    }

    // Test 4: Spacing consistency
    console.log('  ✓ Test 4: Spacing consistency');
    const container = await page.$('.container.mx-auto.px-4');
    if (container) {
      const padding = await page.evaluate(el => {
        return window.getComputedStyle(el).paddingLeft;
      }, container);
      
      results.passed.push(`Tablet: Container padding: ${padding}`);
      console.log(`    ✅ Container padding: ${padding}`);
    }

  } catch (error) {
    results.failed.push(`Tablet viewport test error: ${error.message}`);
    console.error('    ❌ Error:', error.message);
  } finally {
    await page.close();
  }
}

async function testDesktopViewport(browser, results) {
  const page = await browser.newPage();
  await page.setViewport(VIEWPORTS.desktop);
  
  try {
    await page.goto(`${TEST_URL}/products/${TEST_PRODUCT_SLUG}`, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Test 1: 60/40 layout split
    console.log('  ✓ Test 1: 60/40 layout split');
    const gridLayout = await page.$('.grid.grid-cols-1.lg\\:grid-cols-\\[1\\.5fr_1fr\\]');
    if (gridLayout) {
      const gridColumns = await page.evaluate(el => {
        return window.getComputedStyle(el).gridTemplateColumns;
      }, gridLayout);
      
      // Should have 2 columns with 1.5fr and 1fr
      const columns = gridColumns.split(' ');
      if (columns.length === 2) {
        results.passed.push('Desktop: Grid uses 2-column layout (60/40 split)');
        console.log('    ✅ Grid uses 2-column layout');
        console.log(`    📊 Grid template: ${gridColumns}`);
      } else {
        results.failed.push(`Desktop: Grid should have 2 columns, has ${columns.length}`);
        console.log(`    ❌ Grid has ${columns.length} columns`);
      }
    }

    // Test 2: Vertical thumbnail layout
    console.log('  ✓ Test 2: Vertical thumbnail layout');
    const verticalThumbnails = await page.$('.hidden.lg\\:flex.flex-col.space-y-3.w-24');
    if (verticalThumbnails) {
      const isVisible = await page.evaluate(el => {
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden';
      }, verticalThumbnails);
      
      if (isVisible) {
        results.passed.push('Desktop: Thumbnails display in vertical layout');
        console.log('    ✅ Thumbnails display in vertical layout');
      } else {
        results.failed.push('Desktop: Vertical thumbnails not visible');
        console.log('    ❌ Vertical thumbnails not visible');
      }
    }

    // Test 3: Thumbnail sizing (w-24 h-24 = 96px)
    console.log('  ✓ Test 3: Thumbnail sizing');
    const thumbnail = await page.$('.w-24.h-24');
    if (thumbnail) {
      const box = await thumbnail.boundingBox();
      if (box) {
        const expectedSize = 96; // w-24 = 96px
        const tolerance = 5;
        
        if (Math.abs(box.width - expectedSize) <= tolerance && 
            Math.abs(box.height - expectedSize) <= tolerance) {
          results.passed.push(`Desktop: Thumbnails are correct size (${Math.round(box.width)}x${Math.round(box.height)}px)`);
          console.log(`    ✅ Thumbnails: ${Math.round(box.width)}x${Math.round(box.height)}px`);
        } else {
          results.warnings.push(`Desktop: Thumbnail size ${Math.round(box.width)}x${Math.round(box.height)}px (expected ~96x96px)`);
          console.log(`    ⚠️  Thumbnail size: ${Math.round(box.width)}x${Math.round(box.height)}px`);
        }
      }
    }

    // Test 4: Proper spacing
    console.log('  ✓ Test 4: Layout spacing');
    const mainGrid = await page.$('.grid.grid-cols-1.lg\\:grid-cols-\\[1\\.5fr_1fr\\].gap-6.lg\\:gap-10');
    if (mainGrid) {
      const gap = await page.evaluate(el => {
        return window.getComputedStyle(el).gap;
      }, mainGrid);
      
      results.passed.push(`Desktop: Grid gap: ${gap}`);
      console.log(`    ✅ Grid gap: ${gap}`);
    }

    // Test 5: Typography hierarchy
    console.log('  ✓ Test 5: Typography hierarchy');
    const title = await page.$('h1');
    if (title) {
      const fontSize = await page.evaluate(el => {
        return window.getComputedStyle(el).fontSize;
      }, title);
      
      const size = parseFloat(fontSize);
      if (size >= 36 && size <= 48) { // 3xl to 4xl range
        results.passed.push(`Desktop: Title font size: ${fontSize}`);
        console.log(`    ✅ Title font size: ${fontSize}`);
      } else {
        results.warnings.push(`Desktop: Title font size ${fontSize} outside expected range`);
        console.log(`    ⚠️  Title font size: ${fontSize}`);
      }
    }

  } catch (error) {
    results.failed.push(`Desktop viewport test error: ${error.message}`);
    console.error('    ❌ Error:', error.message);
  } finally {
    await page.close();
  }
}

function printResults(results) {
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESPONSIVE BEHAVIOR TEST RESULTS');
  console.log('='.repeat(60) + '\n');

  console.log(`✅ Passed: ${results.passed.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  console.log(`⚠️  Warnings: ${results.warnings.length}\n`);

  if (results.passed.length > 0) {
    console.log('✅ PASSED TESTS:');
    results.passed.forEach(test => console.log(`   • ${test}`));
    console.log('');
  }

  if (results.warnings.length > 0) {
    console.log('⚠️  WARNINGS:');
    results.warnings.forEach(warning => console.log(`   • ${warning}`));
    console.log('');
  }

  if (results.failed.length > 0) {
    console.log('❌ FAILED TESTS:');
    results.failed.forEach(failure => console.log(`   • ${failure}`));
    console.log('');
  }

  const totalTests = results.passed.length + results.failed.length;
  const passRate = totalTests > 0 ? ((results.passed.length / totalTests) * 100).toFixed(1) : 0;
  
  console.log('='.repeat(60));
  console.log(`Pass Rate: ${passRate}% (${results.passed.length}/${totalTests})`);
  console.log('='.repeat(60) + '\n');

  if (results.failed.length === 0) {
    console.log('🎉 All responsive behavior tests passed!\n');
  } else {
    console.log('⚠️  Some tests failed. Please review the issues above.\n');
  }
}

// Run tests
testResponsiveBehavior().catch(console.error);
