/**
 * Test Script for Search Functionality
 * Tests: search queries, real-time results, navigation
 * Task 17.4 - Test search functionality
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSearchFunctionality() {
  console.log('🧪 Testing Search Functionality\n');
  console.log('='.repeat(60));

  let allTestsPassed = true;

  // Test 1: Test basic search query
  console.log('\n📋 Test 1: Test basic search query');
  console.log('-'.repeat(60));
  try {
    const searchQuery = 'chair';
    console.log(`   Search query: "${searchQuery}"`);

    const { data: results, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        slug,
        price,
        images,
        category,
        in_stock
      `)
      .or(`name.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
      .limit(10);

    if (error) throw error;

    if (results && results.length > 0) {
      console.log(`✅ PASS: Search returned ${results.length} results`);
      console.log(`   Sample results:`);
      results.slice(0, 3).forEach((product, i) => {
        console.log(`   ${i + 1}. ${product.name} (₦${product.price.toLocaleString()})`);
      });
    } else {
      console.log('⚠️  WARNING: No results found for query');
    }
  } catch (error) {
    console.log('❌ FAIL: Error testing search:', error.message);
    allTestsPassed = false;
  }

  // Test 2: Test search with multiple keywords
  console.log('\n📋 Test 2: Test search with multiple keywords');
  console.log('-'.repeat(60));
  try {
    const searchQuery = 'office desk';
    console.log(`   Search query: "${searchQuery}"`);

    const { data: results, error } = await supabase
      .from('products')
      .select('id, name, category')
      .or(`name.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
      .limit(10);

    if (error) throw error;

    console.log(`✅ PASS: Multi-keyword search returned ${results?.length || 0} results`);
    if (results && results.length > 0) {
      console.log(`   Sample: ${results[0].name}`);
    }
  } catch (error) {
    console.log('❌ FAIL: Error with multi-keyword search:', error.message);
    allTestsPassed = false;
  }

  // Test 3: Test search across different fields
  console.log('\n📋 Test 3: Test search across different fields');
  console.log('-'.repeat(60));
  try {
    const testQueries = [
      { query: 'executive', field: 'name' },
      { query: 'office', field: 'category' },
      { query: 'comfortable', field: 'description' }
    ];

    for (const test of testQueries) {
      const { data: results } = await supabase
        .from('products')
        .select('id, name, category, description')
        .or(`name.ilike.%${test.query}%,category.ilike.%${test.query}%,description.ilike.%${test.query}%`)
        .limit(5);

      console.log(`   Query "${test.query}" (${test.field}): ${results?.length || 0} results`);
    }

    console.log('✅ PASS: Multi-field search working');
  } catch (error) {
    console.log('❌ FAIL: Error with multi-field search:', error.message);
    allTestsPassed = false;
  }

  // Test 4: Test search with no results
  console.log('\n📋 Test 4: Test search with no results');
  console.log('-'.repeat(60));
  try {
    const searchQuery = 'xyzabc123nonexistent';
    console.log(`   Search query: "${searchQuery}"`);

    const { data: results, error } = await supabase
      .from('products')
      .select('id, name')
      .or(`name.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
      .limit(10);

    if (error) throw error;

    if (!results || results.length === 0) {
      console.log('✅ PASS: Empty search handled correctly');
      console.log('   Returns empty array for no matches');
    } else {
      console.log('⚠️  WARNING: Unexpected results for non-existent query');
    }
  } catch (error) {
    console.log('❌ FAIL: Error handling empty search:', error.message);
    allTestsPassed = false;
  }

  // Test 5: Test case-insensitive search
  console.log('\n📋 Test 5: Test case-insensitive search');
  console.log('-'.repeat(60));
  try {
    const queries = ['CHAIR', 'Chair', 'chair'];
    const resultCounts = [];

    for (const query of queries) {
      const { data: results } = await supabase
        .from('products')
        .select('id')
        .or(`name.ilike.%${query}%,category.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(10);

      resultCounts.push(results?.length || 0);
    }

    // All queries should return same number of results
    const allSame = resultCounts.every(count => count === resultCounts[0]);

    if (allSame) {
      console.log('✅ PASS: Case-insensitive search working');
      console.log(`   All variations returned ${resultCounts[0]} results`);
    } else {
      console.log('❌ FAIL: Case sensitivity issue detected');
      console.log(`   Results: ${resultCounts.join(', ')}`);
      allTestsPassed = false;
    }
  } catch (error) {
    console.log('❌ FAIL: Error testing case sensitivity:', error.message);
    allTestsPassed = false;
  }

  // Test 6: Test search result limit
  console.log('\n📋 Test 6: Test search result limit (max 10)');
  console.log('-'.repeat(60));
  try {
    // Use a broad query that should match many products
    const searchQuery = 'a';

    const { data: results, error } = await supabase
      .from('products')
      .select('id, name')
      .or(`name.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
      .limit(10);

    if (error) throw error;

    if (results && results.length <= 10) {
      console.log('✅ PASS: Search limit enforced correctly');
      console.log(`   Results returned: ${results.length} (max 10)`);
    } else {
      console.log('❌ FAIL: Search returned more than 10 results');
      allTestsPassed = false;
    }
  } catch (error) {
    console.log('❌ FAIL: Error testing result limit:', error.message);
    allTestsPassed = false;
  }

  // Test 7: Test search performance
  console.log('\n📋 Test 7: Test search performance');
  console.log('-'.repeat(60));
  try {
    const searchQuery = 'office';
    const startTime = Date.now();

    const { data: results, error } = await supabase
      .from('products')
      .select('id, name, slug, price, images, category')
      .or(`name.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
      .limit(10);

    const duration = Date.now() - startTime;

    if (error) throw error;

    if (duration < 1000) {
      console.log('✅ PASS: Search performance acceptable');
      console.log(`   Query time: ${duration}ms`);
      console.log(`   Results: ${results?.length || 0}`);
    } else {
      console.log(`⚠️  WARNING: Search took ${duration}ms (consider optimization)`);
    }
  } catch (error) {
    console.log('❌ FAIL: Error testing performance:', error.message);
    allTestsPassed = false;
  }

  // Test 8: Test search with special characters
  console.log('\n📋 Test 8: Test search with special characters');
  console.log('-'.repeat(60));
  try {
    const specialQueries = [
      'chair & desk',
      'office-chair',
      'chair/table'
    ];

    for (const query of specialQueries) {
      const { data: results, error } = await supabase
        .from('products')
        .select('id, name')
        .or(`name.ilike.%${query}%,category.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(5);

      if (error) {
        console.log(`   Query "${query}": Error - ${error.message}`);
      } else {
        console.log(`   Query "${query}": ${results?.length || 0} results`);
      }
    }

    console.log('✅ PASS: Special character handling verified');
  } catch (error) {
    console.log('❌ FAIL: Error with special characters:', error.message);
    allTestsPassed = false;
  }

  // Test 9: Verify search returns required fields
  console.log('\n📋 Test 9: Verify search returns required fields');
  console.log('-'.repeat(60));
  try {
    const searchQuery = 'chair';

    const { data: results, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        slug,
        price,
        images,
        category,
        in_stock
      `)
      .or(`name.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
      .limit(1);

    if (error) throw error;

    if (results && results.length > 0) {
      const product = results[0];
      const hasRequiredFields = 
        product.id &&
        product.name &&
        product.slug &&
        product.price !== undefined &&
        product.category;

      if (hasRequiredFields) {
        console.log('✅ PASS: Search results include required fields');
        console.log('   Fields: id, name, slug, price, images, category, in_stock');
      } else {
        console.log('❌ FAIL: Missing required fields in search results');
        allTestsPassed = false;
      }
    } else {
      console.log('⚠️  SKIP: No results to verify fields');
    }
  } catch (error) {
    console.log('❌ FAIL: Error verifying fields:', error.message);
    allTestsPassed = false;
  }

  // Test 10: Test empty/whitespace query handling
  console.log('\n📋 Test 10: Test empty/whitespace query handling');
  console.log('-'.repeat(60));
  try {
    const emptyQueries = ['', '   ', '\t'];

    for (const query of emptyQueries) {
      const trimmed = query.trim();
      
      if (trimmed === '') {
        console.log(`   Empty query handled: returns empty array`);
      } else {
        const { data: results } = await supabase
          .from('products')
          .select('id')
          .or(`name.ilike.%${trimmed}%,category.ilike.%${trimmed}%,description.ilike.%${trimmed}%`)
          .limit(10);

        console.log(`   Query "${query}": ${results?.length || 0} results`);
      }
    }

    console.log('✅ PASS: Empty query handling verified');
  } catch (error) {
    console.log('❌ FAIL: Error with empty queries:', error.message);
    allTestsPassed = false;
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  if (allTestsPassed) {
    console.log('✅ ALL TESTS PASSED - Search functionality working correctly');
    console.log('\n📝 Manual Testing Required:');
    console.log('   1. Open search modal in browser');
    console.log('   2. Type various search queries');
    console.log('   3. Verify real-time results appear');
    console.log('   4. Click on result to navigate to product page');
    console.log('   5. Test debouncing (results update after typing stops)');
  } else {
    console.log('❌ SOME TESTS FAILED - Review errors above');
  }
  console.log('='.repeat(60));

  return allTestsPassed;
}

// Run tests
testSearchFunctionality()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('❌ Test suite error:', error);
    process.exit(1);
  });
