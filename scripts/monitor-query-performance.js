/**
 * Supabase Query Performance Monitor
 * Monitors and logs query execution times for optimization
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Color codes
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

// Measure query execution time
async function measureQuery(name, queryFn) {
  const startTime = Date.now();
  
  try {
    const result = await queryFn();
    const duration = Date.now() - startTime;
    
    const status = duration < 500 ? '✓' : duration < 1000 ? '⚠' : '✗';
    const color = duration < 500 ? 'green' : duration < 1000 ? 'yellow' : 'red';
    
    log(`${status} ${name}: ${duration}ms`, color);
    
    if (result.error) {
      log(`  Error: ${result.error.message}`, 'red');
    } else {
      log(`  Rows returned: ${result.data?.length || 0}`, 'blue');
    }
    
    return { name, duration, success: !result.error, rowCount: result.data?.length || 0 };
  } catch (error) {
    const duration = Date.now() - startTime;
    log(`✗ ${name}: ${duration}ms - ERROR`, 'red');
    log(`  ${error.message}`, 'red');
    return { name, duration, success: false, error: error.message };
  }
}

// Test queries
async function testProductQueries() {
  logSection('Product Query Performance Tests');
  
  const results = [];
  
  // Test 1: Simple product list
  results.push(await measureQuery(
    'Simple product list (12 items)',
    () => supabase
      .from('products')
      .select('id, name, slug, price, images, in_stock')
      .range(0, 11)
  ));
  
  // Test 2: Product list with relations
  results.push(await measureQuery(
    'Product list with space & subcategory relations',
    () => supabase
      .from('products')
      .select(`
        id, name, slug, price, images, in_stock,
        space:spaces(id, name, slug),
        subcategory:subcategories(id, name, slug)
      `)
      .range(0, 11)
  ));
  
  // Test 3: Filtered by space
  results.push(await measureQuery(
    'Products filtered by space',
    () => supabase
      .from('products')
      .select('id, name, slug, price, images')
      .eq('space', 1)
      .range(0, 11)
  ));
  
  // Test 4: Filtered by subcategory
  results.push(await measureQuery(
    'Products filtered by subcategory',
    () => supabase
      .from('products')
      .select('id, name, slug, price, images')
      .eq('subcategory', 1)
      .range(0, 11)
  ));
  
  // Test 5: Price range filter
  results.push(await measureQuery(
    'Products with price range filter',
    () => supabase
      .from('products')
      .select('id, name, slug, price')
      .gte('price', 10000)
      .lte('price', 50000)
      .range(0, 11)
  ));
  
  // Test 6: Combined filters
  results.push(await measureQuery(
    'Products with combined filters (space + price)',
    () => supabase
      .from('products')
      .select('id, name, slug, price, images')
      .eq('space', 1)
      .gte('price', 10000)
      .lte('price', 100000)
      .range(0, 11)
  ));
  
  // Test 7: Single product by slug
  results.push(await measureQuery(
    'Single product by slug',
    () => supabase
      .from('products')
      .select(`
        *,
        space:spaces(*),
        subcategory:subcategories(*)
      `)
      .eq('slug', 'test-product')
      .single()
  ));
  
  // Test 8: Search query
  results.push(await measureQuery(
    'Search products (multi-field OR)',
    () => supabase
      .from('products')
      .select('id, name, slug, price, images')
      .or('name.ilike.%chair%,category.ilike.%chair%,description.ilike.%chair%')
      .limit(10)
  ));
  
  // Test 9: Count query
  results.push(await measureQuery(
    'Count total products',
    () => supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
  ));
  
  return results;
}

// Test index effectiveness
async function testIndexEffectiveness() {
  logSection('Index Effectiveness Tests');
  
  const results = [];
  
  // Test indexed columns
  const indexedColumns = ['slug', 'space', 'subcategory', 'price', 'in_stock'];
  
  for (const column of indexedColumns) {
    results.push(await measureQuery(
      `Query using index on '${column}'`,
      () => supabase
        .from('products')
        .select('id, name')
        .eq(column, column === 'price' ? 10000 : 1)
        .limit(10)
    ));
  }
  
  return results;
}

// Test pagination performance
async function testPaginationPerformance() {
  logSection('Pagination Performance Tests');
  
  const results = [];
  const pageSize = 12;
  const pages = [1, 5, 10, 20, 50];
  
  for (const page of pages) {
    const offset = (page - 1) * pageSize;
    results.push(await measureQuery(
      `Page ${page} (offset ${offset})`,
      () => supabase
        .from('products')
        .select('id, name, slug, price')
        .range(offset, offset + pageSize - 1)
    ));
  }
  
  return results;
}

// Check database statistics
async function checkDatabaseStats() {
  logSection('Database Statistics');
  
  try {
    // Count products
    const { count: productCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    
    log(`Total products: ${productCount}`, 'blue');
    
    // Count spaces
    const { count: spaceCount } = await supabase
      .from('spaces')
      .select('*', { count: 'exact', head: true });
    
    log(`Total spaces: ${spaceCount}`, 'blue');
    
    // Count subcategories
    const { count: subcategoryCount } = await supabase
      .from('subcategories')
      .select('*', { count: 'exact', head: true });
    
    log(`Total subcategories: ${subcategoryCount}`, 'blue');
    
    // Check for products with images
    const { count: withImages } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .not('images', 'is', null);
    
    log(`Products with images: ${withImages}`, 'blue');
    
    // Check in-stock products
    const { count: inStock } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('in_stock', true);
    
    log(`Products in stock: ${inStock}`, 'blue');
    
  } catch (error) {
    log(`Error fetching stats: ${error.message}`, 'red');
  }
}

// Main function
async function runMonitoring() {
  console.log('\n');
  log('╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║        SUPABASE QUERY PERFORMANCE MONITORING               ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝', 'cyan');
  
  try {
    // Check database stats
    await checkDatabaseStats();
    
    // Run query tests
    const productResults = await testProductQueries();
    const indexResults = await testIndexEffectiveness();
    const paginationResults = await testPaginationPerformance();
    
    // Summary
    logSection('SUMMARY');
    
    const allResults = [...productResults, ...indexResults, ...paginationResults];
    const avgDuration = allResults.reduce((sum, r) => sum + r.duration, 0) / allResults.length;
    const maxDuration = Math.max(...allResults.map(r => r.duration));
    const minDuration = Math.min(...allResults.map(r => r.duration));
    const successRate = (allResults.filter(r => r.success).length / allResults.length) * 100;
    
    log(`\nTotal queries tested: ${allResults.length}`, 'blue');
    log(`Success rate: ${successRate.toFixed(1)}%`, successRate === 100 ? 'green' : 'yellow');
    log(`Average query time: ${avgDuration.toFixed(2)}ms`, 'blue');
    log(`Fastest query: ${minDuration}ms`, 'green');
    log(`Slowest query: ${maxDuration}ms`, maxDuration > 1000 ? 'red' : 'yellow');
    
    // Recommendations
    logSection('RECOMMENDATIONS');
    
    const slowQueries = allResults.filter(r => r.duration > 500);
    if (slowQueries.length > 0) {
      log(`\n⚠️  ${slowQueries.length} slow queries detected (>500ms):`, 'yellow');
      slowQueries.forEach(q => {
        log(`  • ${q.name}: ${q.duration}ms`, 'yellow');
      });
      log('\nConsider:', 'blue');
      log('  • Adding database indexes on frequently queried columns', 'blue');
      log('  • Reducing the number of joined relations', 'blue');
      log('  • Using select() to fetch only required columns', 'blue');
    } else {
      log('✓ All queries performing well!', 'green');
    }
    
    if (avgDuration > 300) {
      log('\n⚠️  Average query time is high', 'yellow');
      log('  • Review database indexes', 'blue');
      log('  • Check Supabase instance performance tier', 'blue');
    }
    
    log('\n✓ Query performance monitoring complete!', 'green');
    
  } catch (error) {
    log(`\n❌ Monitoring error: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

// Run monitoring
if (require.main === module) {
  runMonitoring().catch(console.error);
}

module.exports = { runMonitoring };
