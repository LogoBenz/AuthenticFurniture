/**
 * Detailed Responsive Test - Find overflow sources
 */

const puppeteer = require('puppeteer');

const TEST_URL = 'http://localhost:3000';
const TEST_PRODUCT_SLUG = 'the-smartstart-study-desk';

async function findOverflowSources() {
  console.log('🔍 Finding overflow sources on mobile...\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 667 });
  
  try {
    await page.goto(`${TEST_URL}/products/${TEST_PRODUCT_SLUG}`, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Find elements wider than viewport
    const wideElements = await page.evaluate(() => {
      const viewportWidth = 375;
      const elements = document.querySelectorAll('*');
      const wide = [];
      
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.width > viewportWidth) {
          const styles = window.getComputedStyle(el);
          wide.push({
            tag: el.tagName,
            class: el.className,
            width: Math.round(rect.width),
            overflow: styles.overflow,
            overflowX: styles.overflowX,
            text: el.textContent?.substring(0, 50)
          });
        }
      });
      
      return wide;
    });

    console.log('Elements wider than 375px:');
    wideElements.forEach((el, i) => {
      if (i < 10) { // Show first 10
        console.log(`  ${i + 1}. <${el.tag}> width: ${el.width}px`);
        console.log(`     class: ${el.class}`);
        console.log(`     overflow: ${el.overflow}, overflowX: ${el.overflowX}`);
        console.log('');
      }
    });

    // Check body scroll width
    const scrollInfo = await page.evaluate(() => {
      return {
        bodyScrollWidth: document.body.scrollWidth,
        bodyClientWidth: document.body.clientWidth,
        htmlScrollWidth: document.documentElement.scrollWidth,
        htmlClientWidth: document.documentElement.clientWidth
      };
    });

    console.log('Scroll dimensions:');
    console.log(`  body.scrollWidth: ${scrollInfo.bodyScrollWidth}px`);
    console.log(`  body.clientWidth: ${scrollInfo.bodyClientWidth}px`);
    console.log(`  html.scrollWidth: ${scrollInfo.htmlScrollWidth}px`);
    console.log(`  html.clientWidth: ${scrollInfo.htmlClientWidth}px`);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
}

findOverflowSources().catch(console.error);
