/**
 * Performance Testing Script for Production SSR Refactor
 * Tests: page load times, pagination, filters, image optimization, cache hits, and query performance
 */

const https = require('https');
const http = require('http');

// Configuration
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const TARGET_LOAD_TIME = 2000; // 2 seconds target

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'cyan');
  console.log('='.repeat(60));
}

function logResult(test, passed, details = '') {
  const status = passed ? '✓ PASS' : '✗ FAIL';
  const color = passed ? 'green' : 'red';
  log(`${status} - ${test}`, color);
  if (details) {
    console.log(`  ${details}`);
  }
}

// Fetch with timing
async function fetchWithTiming(url, options = {}) {
  const startTime = Date.now();
  
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data,
          duration,
          cached: res.headers['x-nextjs-cache'] === 'HIT',
        });
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Test 1: Products page load time
async function testProductsPageLoadTime() {
  logSection('Test 1: Products Page Load Time (Target < 2s)');
  
  try {
    const result = await fetchWithTiming(`${BASE_URL}/products`);
    const passed = result.duration < TARGET_LOAD_TIME;
    
    logResult(
      'Products page load time',
      passed,
      `Duration: ${result.duration}ms (Target: ${TARGET_LOAD_TIME}ms)`
    );
    
    if (result.cached) {
      log('  Cache: HIT', 'green');
    } else {
      log('  Cache: MISS', 'yellow');
    }
    
    return { passed, duration: result.duration };
  } catch (error) {
    logResult('Products page load time', false, `Error: ${error.message}`);
    return { passed: false, error: error.message };
  }
}

// Test 2: Pagination performance
async function testPaginationPerformance() {
  logSection('Test 2: Pagination Performance');
  
  const pages = [1, 2, 3, 5, 10];
  const results = [];
  
  for (const page of pages) {
    try {
      const result = await fetchWithTiming(`${BASE_URL}/products?page=${page}`);
      const passed = result.duration < TARGET_LOAD_TIME;
      
      results.push({ page, duration: result.duration, passed });
      
      logResult(
        `Page ${page} load time`,
        passed,
        `Duration: ${result.duration}ms`
      );
    } catch (error) {
      logResult(`Page ${page} load time`, false, `Error: ${error.message}`);
      results.push({ page, passed: false, error: error.message });
    }
  }
  
  const avgDuration = results
    .filter(r => r.duration)
    .reduce((sum, r) => sum + r.duration, 0) / results.filter(r => r.duration).length;
  
  log(`\n  Average pagination load time: ${avgDuration.toFixed(2)}ms`, 'blue');
  
  return results;
}

// Test 3: Filter combinations performance
async function testFilterCombinations() {
  logSection('Test 3: Filter Combinations Performance');
  
  const filterTests = [
    { name: 'Space filter', params: 'space=office' },
    { name: 'Subcategory filter', params: 'subcategory=office-chairs' },
    { name: 'Price range filter', params: 'price_min=10000&price_max=50000' },
    { name: 'Combined filters', params: 'space=office&subcategory=office-chairs&price_min=10000' },
    { name: 'All filters + pagination', params: 'space=office&subcategory=office-chairs&price_min=10000&price_max=100000&page=2' },
  ];
  
  const results = [];
  
  for (const test of filterTests) {
    try {
      const result = await fetchWithTiming(`${BASE_URL}/products?${test.params}`);
      const passed = result.duration < TARGET_LOAD_TIME;
      
      results.push({ name: test.name, duration: result.duration, passed });
      
      logResult(
        test.name,
        passed,
        `Duration: ${result.duration}ms`
      );
    } catch (error) {
      logResult(test.name, false, `Error: ${error.message}`);
      results.push({ name: test.name, passed: false, error: error.message });
    }
  }
  
  return results;
}

// Test 4: Product detail page performance
async function testProductDetailPage() {
  logSection('Test 4: Product Detail Page Performance');
  
  // Test with a common slug pattern
  const testSlugs = ['office-chair-1', 'executive-desk', 'conference-table'];
  const results = [];
  
  for (const slug of testSlugs) {
    try {
      const result = await fetchWithTiming(`${BASE_URL}/products/${slug}`);
      
      if (result.statusCode === 404) {
        log(`  Skipping ${slug} (404 - product not found)`, 'yellow');
        continue;
      }
      
      const passed = result.duration < TARGET_LOAD_TIME;
      results.push({ slug, duration: result.duration, passed });
      
      logResult(
        `Product detail: ${slug}`,
        passed,
        `Duration: ${result.duration}ms`
      );
    } catch (error) {
      logResult(`Product detail: ${slug}`, false, `Error: ${error.message}`);
    }
  }
  
  if (results.length === 0) {
    log('  No valid product pages found for testing', 'yellow');
  }
  
  return results;
}

// Test 5: Cache hit rate test
async function testCacheHitRate() {
  logSection('Test 5: Cache Hit Rate Test');
  
  const testUrl = `${BASE_URL}/products`;
  const iterations = 5;
  let hits = 0;
  let misses = 0;
  
  log('Making multiple requests to test cache behavior...', 'blue');
  
  for (let i = 0; i < iterations; i++) {
    try {
      const result = await fetchWithTiming(testUrl);
      
      if (result.cached || result.headers['x-nextjs-cache'] === 'HIT') {
        hits++;
        log(`  Request ${i + 1}: CACHE HIT (${result.duration}ms)`, 'green');
      } else {
        misses++;
        log(`  Request ${i + 1}: CACHE MISS (${result.duration}ms)`, 'yellow');
      }
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      log(`  Request ${i + 1}: ERROR - ${error.message}`, 'red');
    }
  }
  
  const hitRate = (hits / iterations) * 100;
  log(`\n  Cache Hit Rate: ${hitRate.toFixed(1)}% (${hits}/${iterations})`, 'blue');
  
  // After ISR implementation, we expect some cache hits
  const passed = hits > 0;
  logResult('Cache functionality', passed, `Hit rate: ${hitRate.toFixed(1)}%`);
  
  return { hits, misses, hitRate, passed };
}

// Test 6: Image optimization check
async function testImageOptimization() {
  logSection('Test 6: Image Optimization Check');
  
  try {
    const result = await fetchWithTiming(`${BASE_URL}/products`);
    const html = result.data;
    
    // Check for Next.js Image component usage
    const hasNextImage = html.includes('_next/image') || html.includes('next/image');
    logResult('Next.js Image component usage', hasNextImage);
    
    // Check for lazy loading
    const hasLazyLoading = html.includes('loading="lazy"') || html.includes('loading=\\"lazy\\"');
    logResult('Lazy loading enabled', hasLazyLoading);
    
    // Check for WebP support
    const hasWebP = html.includes('image/webp') || html.includes('.webp');
    logResult('WebP format support', hasWebP, hasWebP ? '' : '(Optional - may not be visible in HTML)');
    
    // Check for responsive images
    const hasSrcSet = html.includes('srcset') || html.includes('srcSet');
    logResult('Responsive images (srcset)', hasSrcSet);
    
    return {
      hasNextImage,
      hasLazyLoading,
      hasWebP,
      hasSrcSet,
      passed: hasNextImage && hasLazyLoading,
    };
  } catch (error) {
    logResult('Image optimization check', false, `Error: ${error.message}`);
    return { passed: false, error: error.message };
  }
}

// Test 7: Response headers check
async function testResponseHeaders() {
  logSection('Test 7: Response Headers & Caching Configuration');
  
  try {
    const result = await fetchWithTiming(`${BASE_URL}/products`);
    const headers = result.headers;
    
    log('Response Headers:', 'blue');
    console.log(`  Cache-Control: ${headers['cache-control'] || 'Not set'}`);
    console.log(`  X-NextJS-Cache: ${headers['x-nextjs-cache'] || 'Not set'}`);
    console.log(`  Content-Type: ${headers['content-type'] || 'Not set'}`);
    console.log(`  Content-Encoding: ${headers['content-encoding'] || 'Not set'}`);
    
    // Check for proper cache headers
    const hasCacheControl = !!headers['cache-control'];
    logResult('Cache-Control header present', hasCacheControl);
    
    return { headers, passed: true };
  } catch (error) {
    logResult('Response headers check', false, `Error: ${error.message}`);
    return { passed: false, error: error.message };
  }
}

// Test 8: Concurrent request handling
async function testConcurrentRequests() {
  logSection('Test 8: Concurrent Request Handling');
  
  const concurrentRequests = 10;
  log(`Making ${concurrentRequests} concurrent requests...`, 'blue');
  
  const startTime = Date.now();
  
  try {
    const promises = Array(concurrentRequests)
      .fill(null)
      .map((_, i) => fetchWithTiming(`${BASE_URL}/products?page=${(i % 3) + 1}`));
    
    const results = await Promise.all(promises);
    const totalTime = Date.now() - startTime;
    
    const avgDuration = results.reduce((sum, r) => sum + r.duration, 0) / results.length;
    const maxDuration = Math.max(...results.map(r => r.duration));
    const minDuration = Math.min(...results.map(r => r.duration));
    
    log(`\n  Total time: ${totalTime}ms`, 'blue');
    log(`  Average request time: ${avgDuration.toFixed(2)}ms`, 'blue');
    log(`  Min request time: ${minDuration}ms`, 'blue');
    log(`  Max request time: ${maxDuration}ms`, 'blue');
    
    const passed = avgDuration < TARGET_LOAD_TIME;
    logResult('Concurrent request handling', passed, `Avg: ${avgDuration.toFixed(2)}ms`);
    
    return { passed, avgDuration, maxDuration, minDuration, totalTime };
  } catch (error) {
    logResult('Concurrent request handling', false, `Error: ${error.message}`);
    return { passed: false, error: error.message };
  }
}

// Main test runner
async function runAllTests() {
  console.log('\n');
  log('╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║     PERFORMANCE TESTING - PRODUCTION SSR REFACTOR          ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝', 'cyan');
  log(`\nTesting against: ${BASE_URL}`, 'blue');
  log(`Target load time: ${TARGET_LOAD_TIME}ms\n`, 'blue');
  
  const results = {
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL,
    targetLoadTime: TARGET_LOAD_TIME,
    tests: {},
  };
  
  try {
    // Run all tests
    results.tests.productsPageLoadTime = await testProductsPageLoadTime();
    results.tests.paginationPerformance = await testPaginationPerformance();
    results.tests.filterCombinations = await testFilterCombinations();
    results.tests.productDetailPage = await testProductDetailPage();
    results.tests.cacheHitRate = await testCacheHitRate();
    results.tests.imageOptimization = await testImageOptimization();
    results.tests.responseHeaders = await testResponseHeaders();
    results.tests.concurrentRequests = await testConcurrentRequests();
    
    // Summary
    logSection('SUMMARY');
    
    const allTests = [
      results.tests.productsPageLoadTime,
      ...(results.tests.paginationPerformance || []),
      ...(results.tests.filterCombinations || []),
      ...(results.tests.productDetailPage || []),
      results.tests.cacheHitRate,
      results.tests.imageOptimization,
      results.tests.responseHeaders,
      results.tests.concurrentRequests,
    ].filter(Boolean);
    
    const passedTests = allTests.filter(t => t.passed).length;
    const totalTests = allTests.length;
    const passRate = (passedTests / totalTests) * 100;
    
    log(`\nTests Passed: ${passedTests}/${totalTests} (${passRate.toFixed(1)}%)`, 'blue');
    
    if (passRate === 100) {
      log('\n🎉 All performance tests passed!', 'green');
    } else if (passRate >= 80) {
      log('\n⚠️  Most tests passed, but some optimizations needed', 'yellow');
    } else {
      log('\n❌ Performance issues detected - optimization required', 'red');
    }
    
    // Recommendations
    logSection('RECOMMENDATIONS');
    
    if (results.tests.productsPageLoadTime?.duration > TARGET_LOAD_TIME) {
      log('• Optimize products page load time - consider reducing initial data fetch', 'yellow');
    }
    
    if (results.tests.cacheHitRate?.hitRate < 50) {
      log('• Cache hit rate is low - verify ISR configuration and revalidate settings', 'yellow');
    }
    
    if (!results.tests.imageOptimization?.hasNextImage) {
      log('• Implement Next.js Image component for better image optimization', 'yellow');
    }
    
    if (results.tests.concurrentRequests?.avgDuration > TARGET_LOAD_TIME) {
      log('• Concurrent request performance needs improvement - check database indexes', 'yellow');
    }
    
    log('\n✓ Performance testing complete!', 'green');
    
    // Save results to file
    const fs = require('fs');
    const resultsFile = `performance-test-results-${Date.now()}.json`;
    fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
    log(`\nResults saved to: ${resultsFile}`, 'blue');
    
  } catch (error) {
    log(`\n❌ Test suite error: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

// Run tests
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { runAllTests };
