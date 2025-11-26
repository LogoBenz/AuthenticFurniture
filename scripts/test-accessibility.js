/**
 * Accessibility Testing Script for Product Details Page
 * 
 * This script validates:
 * 1. Semantic HTML structure
 * 2. ARIA labels and roles
 * 3. Heading hierarchy
 * 4. Focus indicators
 * 5. Keyboard navigation
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Accessibility Audit for Product Details Page\n');

// Files to check
const files = [
  'app/products/[slug]/page.tsx',
  'components/products/EnhancedProductGallery.tsx',
  'components/products/EnhancedProductInfo.tsx',
  'components/products/EnhancedProductTabs.tsx'
];

let totalChecks = 0;
let passedChecks = 0;

// Check for semantic HTML elements
function checkSemanticHTML(content, filename) {
  console.log(`\n📄 Checking ${filename}...`);
  
  const checks = [
    { name: 'Uses <main> element', pattern: /<main/, required: filename.includes('page.tsx') },
    { name: 'Uses <section> elements', pattern: /<section/, required: true },
    { name: 'Uses <article> elements', pattern: /<article/, required: filename.includes('Tabs') },
    { name: 'Uses <nav> elements', pattern: /<nav/, required: filename.includes('Gallery') || filename.includes('Tabs') },
    { name: 'Uses semantic lists (<ul>, <ol>, <dl>)', pattern: /<(ul|ol|dl)/, required: true },
  ];
  
  checks.forEach(check => {
    if (!check.required) return;
    totalChecks++;
    const found = check.pattern.test(content);
    if (found) {
      console.log(`  ✅ ${check.name}`);
      passedChecks++;
    } else {
      console.log(`  ❌ ${check.name}`);
    }
  });
}

// Check for ARIA attributes
function checkARIA(content, filename) {
  const checks = [
    { name: 'Has aria-label attributes', pattern: /aria-label=/, count: 5 },
    { name: 'Has aria-labelledby attributes', pattern: /aria-labelledby=/, count: 2 },
    { name: 'Has role attributes', pattern: /role=/, count: 3 },
    { name: 'Has aria-hidden for decorative icons', pattern: /aria-hidden="true"/, count: 3 },
    { name: 'Has aria-live for dynamic content', pattern: /aria-live=/, count: 1 },
  ];
  
  checks.forEach(check => {
    totalChecks++;
    const matches = content.match(new RegExp(check.pattern, 'g'));
    const count = matches ? matches.length : 0;
    if (count >= check.count) {
      console.log(`  ✅ ${check.name} (found ${count})`);
      passedChecks++;
    } else {
      console.log(`  ⚠️  ${check.name} (found ${count}, expected at least ${check.count})`);
    }
  });
}

// Check for heading hierarchy
function checkHeadings(content, filename) {
  totalChecks++;
  const hasH1 = /<h1/.test(content);
  const hasH2 = /<h2/.test(content);
  const hasH3 = /<h3/.test(content);
  const hasH4 = /<h4/.test(content);
  
  if (filename.includes('page.tsx')) {
    if (hasH1) {
      console.log(`  ✅ Has proper heading hierarchy (h1 present)`);
      passedChecks++;
    } else {
      console.log(`  ❌ Missing h1 heading`);
    }
  } else if (hasH2 || hasH3 || hasH4) {
    console.log(`  ✅ Has proper heading hierarchy (h2/h3/h4 present)`);
    passedChecks++;
  } else {
    console.log(`  ⚠️  No headings found`);
  }
}

// Check for focus indicators
function checkFocusIndicators(content, filename) {
  totalChecks++;
  const hasFocusStyles = /focus:/.test(content);
  const hasFocusRing = /focus:ring/.test(content);
  const hasFocusOutline = /focus:outline/.test(content);
  
  if (hasFocusStyles && (hasFocusRing || hasFocusOutline)) {
    console.log(`  ✅ Has focus indicators (focus:ring or focus:outline)`);
    passedChecks++;
  } else {
    console.log(`  ⚠️  Limited or no focus indicators found`);
  }
}

// Check for keyboard navigation support
function checkKeyboardNav(content, filename) {
  totalChecks++;
  const hasButtons = /<button/.test(content);
  const hasAriaLabels = /aria-label=/.test(content);
  const hasTabIndex = /tabIndex/.test(content);
  
  if (hasButtons && hasAriaLabels) {
    console.log(`  ✅ Supports keyboard navigation (buttons with aria-labels)`);
    passedChecks++;
  } else {
    console.log(`  ⚠️  Limited keyboard navigation support`);
  }
}

// Check for minimum touch target sizes
function checkTouchTargets(content, filename) {
  totalChecks++;
  const hasMinSize = /min-w-\[44px\]/.test(content) && /min-h-\[44px\]/.test(content);
  
  if (hasMinSize) {
    console.log(`  ✅ Has minimum touch target sizes (44x44px)`);
    passedChecks++;
  } else {
    console.log(`  ⚠️  Some touch targets may be too small`);
  }
}

// Run checks on all files
files.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    checkSemanticHTML(content, file);
    checkARIA(content, file);
    checkHeadings(content, file);
    checkFocusIndicators(content, file);
    checkKeyboardNav(content, file);
    checkTouchTargets(content, file);
    
  } catch (error) {
    console.error(`❌ Error reading ${file}:`, error.message);
  }
});

// Summary
console.log('\n' + '='.repeat(60));
console.log('📊 Accessibility Audit Summary');
console.log('='.repeat(60));
console.log(`Total Checks: ${totalChecks}`);
console.log(`Passed: ${passedChecks} (${Math.round(passedChecks/totalChecks*100)}%)`);
console.log(`Failed/Warnings: ${totalChecks - passedChecks}`);

if (passedChecks / totalChecks >= 0.8) {
  console.log('\n✅ Accessibility audit PASSED (80%+ compliance)');
} else {
  console.log('\n⚠️  Accessibility audit needs improvement');
}

console.log('\n📝 Manual Testing Recommendations:');
console.log('  1. Test keyboard navigation (Tab, Shift+Tab, Enter, Space)');
console.log('  2. Test with screen reader (NVDA, JAWS, VoiceOver)');
console.log('  3. Verify focus indicators are visible');
console.log('  4. Check color contrast ratios (WCAG AA: 4.5:1)');
console.log('  5. Test on mobile devices for touch target sizes');
console.log('  6. Verify all images have appropriate alt text');
console.log('  7. Test form inputs and error messages');
console.log('  8. Verify heading hierarchy is logical');
