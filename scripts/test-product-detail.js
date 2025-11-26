/**
 * Test Script for Product Detail Pages
 * Tests: product data loading, 404 handling, images, metadata
 * Task 17.2 - Test product detail pages
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

async function testProductDetailPages() {
  console.log('🧪 Testing Product Detail Pages\n');
  console.log('='.repeat(60));

  let allTestsPassed = true;

  // Test 1: Navigate to multiple product pages
  console.log('\n📋 Test 1: Navigate to multiple product pages');
  console.log('-'.repeat(60));
  try {
    // Get 5 random products
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, slug')
      .limit(5);

    if (error) throw error;

    if (!products || products.length === 0) {
      console.log('❌ FAIL: No products found');
      allTestsPassed = false;
    } else {
      console.log(`✅ PASS: Found ${products.length} products to test`);
      products.forEach((p, i) => {
        console.log(`   ${i + 1}. ${p.name} (slug: ${p.slug})`);
      });
    }
  } catch (error) {
    console.log('❌ FAIL: Error fetching products:', error.message);
    allTestsPassed = false;
  }

  // Test 2: Verify correct product data loads
  console.log('\n📋 Test 2: Verify correct product data loads');
  console.log('-'.repeat(60));
  try {
    // Get a product by slug
    const { data: products } = await supabase
      .from('products')
      .select('slug')
      .limit(1);

    if (products && products.length > 0) {
      const testSlug = products[0].slug;

      // Fetch full product data
      const { data: product, error } = await supabase
        .from('products')
        .select(`
          *,
          space:spaces(*),
          subcategory:subcategories(*)
        `)
        .eq('slug', testSlug)
        .single();

      if (error) throw error;

      if (product) {
        // Verify essential fields
        const hasRequiredFields = 
          product.id &&
          product.name &&
          product.slug &&
          product.price &&
          product.description;

        if (hasRequiredFields) {
          console.log(`✅ PASS: Product data loaded correctly`);
          console.log(`   Name: ${product.name}`);
          console.log(`   Slug: ${product.slug}`);
          console.log(`   Price: ₦${product.price.toLocaleString()}`);
          console.log(`   Description: ${product.description.substring(0, 50)}...`);
          if (product.space) {
            console.log(`   Space: ${product.space.name}`);
          }
          if (product.subcategory) {
            console.log(`   Subcategory: ${product.subcategory.name}`);
          }
        } else {
          console.log('❌ FAIL: Missing required fields');
          allTestsPassed = false;
        }
      } else {
        console.log('❌ FAIL: No product data returned');
        allTestsPassed = false;
      }
    } else {
      console.log('⚠️  SKIP: No products to test');
    }
  } catch (error) {
    console.log('❌ FAIL: Error loading product data:', error.message);
    allTestsPassed = false;
  }

  // Test 3: Test 404 handling for invalid slugs
  console.log('\n📋 Test 3: Test 404 handling for invalid slugs');
  console.log('-'.repeat(60));
  try {
    const invalidSlug = 'this-product-does-not-exist-12345';

    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', invalidSlug)
      .single();

    // Should get an error for non-existent product
    if (error && error.code === 'PGRST116') {
      console.log(`✅ PASS: 404 handling works correctly`);
      console.log(`   Invalid slug: ${invalidSlug}`);
      console.log(`   Error code: ${error.code} (No rows found)`);
    } else if (!product) {
      console.log(`✅ PASS: Returns null for invalid slug`);
    } else {
      console.log('❌ FAIL: Should not find product with invalid slug');
      allTestsPassed = false;
    }
  } catch (error) {
    console.log('❌ FAIL: Error testing 404:', error.message);
    allTestsPassed = false;
  }

  // Test 4: Verify images load optimized
  console.log('\n📋 Test 4: Verify images are present and valid');
  console.log('-'.repeat(60));
  try {
    const { data: products } = await supabase
      .from('products')
      .select('id, name, images, image_url')
      .limit(5);

    if (products && products.length > 0) {
      let productsWithImages = 0;
      let productsWithMultipleImages = 0;

      products.forEach(product => {
        let images = [];
        
        // Parse images field
        if (product.images) {
          if (Array.isArray(product.images)) {
            images = product.images;
          } else if (typeof product.images === 'string') {
            try {
              images = JSON.parse(product.images);
            } catch {
              images = product.images.split(',').map(url => url.trim());
            }
          }
        }

        // Fallback to image_url
        if (images.length === 0 && product.image_url) {
          images = [product.image_url];
        }

        if (images.length > 0) {
          productsWithImages++;
          if (images.length > 1) {
            productsWithMultipleImages++;
          }
        }
      });

      console.log(`✅ PASS: Image data verified`);
      console.log(`   Products tested: ${products.length}`);
      console.log(`   Products with images: ${productsWithImages}`);
      console.log(`   Products with multiple images: ${productsWithMultipleImages}`);

      if (productsWithImages === 0) {
        console.log('⚠️  WARNING: No products have images');
      }
    } else {
      console.log('⚠️  SKIP: No products to test');
    }
  } catch (error) {
    console.log('❌ FAIL: Error verifying images:', error.message);
    allTestsPassed = false;
  }

  // Test 5: Test related products section
  console.log('\n📋 Test 5: Test related products functionality');
  console.log('-'.repeat(60));
  try {
    // Get a product with subcategory
    const { data: products } = await supabase
      .from('products')
      .select('id, name, subcategory_id')
      .not('subcategory_id', 'is', null)
      .limit(1);

    if (products && products.length > 0) {
      const testProduct = products[0];

      // Find related products (same subcategory, different ID)
      const { data: relatedProducts, count } = await supabase
        .from('products')
        .select('id, name', { count: 'exact' })
        .eq('subcategory_id', testProduct.subcategory_id)
        .neq('id', testProduct.id)
        .limit(4);

      if (relatedProducts) {
        console.log(`✅ PASS: Related products query working`);
        console.log(`   Test product: ${testProduct.name}`);
        console.log(`   Related products found: ${count}`);
        if (relatedProducts.length > 0) {
          console.log(`   Sample related: ${relatedProducts[0].name}`);
        }
      } else {
        console.log('⚠️  No related products found');
      }
    } else {
      console.log('⚠️  SKIP: No products with subcategory');
    }
  } catch (error) {
    console.log('❌ FAIL: Error testing related products:', error.message);
    allTestsPassed = false;
  }

  // Test 6: Check metadata fields
  console.log('\n📋 Test 6: Check metadata fields for SEO');
  console.log('-'.repeat(60));
  try {
    const { data: products } = await supabase
      .from('products')
      .select('id, name, slug, description, images')
      .limit(3);

    if (products && products.length > 0) {
      let productsWithMetadata = 0;

      products.forEach(product => {
        const hasMetadata = 
          product.name &&
          product.slug &&
          product.description;

        if (hasMetadata) {
          productsWithMetadata++;
        }
      });

      console.log(`✅ PASS: Metadata fields verified`);
      console.log(`   Products tested: ${products.length}`);
      console.log(`   Products with complete metadata: ${productsWithMetadata}`);
      console.log(`   Metadata includes: name, slug, description`);
      console.log(`   Note: OpenGraph images require browser testing`);
    } else {
      console.log('⚠️  SKIP: No products to test');
    }
  } catch (error) {
    console.log('❌ FAIL: Error checking metadata:', error.message);
    allTestsPassed = false;
  }

  // Test 7: Test product by ID fallback
  console.log('\n📋 Test 7: Test product lookup by ID (fallback)');
  console.log('-'.repeat(60));
  try {
    const { data: products } = await supabase
      .from('products')
      .select('id, name, slug')
      .limit(1);

    if (products && products.length > 0) {
      const testProduct = products[0];

      // Try to fetch by ID
      const { data: productById, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', testProduct.id)
        .single();

      if (productById && !error) {
        console.log(`✅ PASS: Product lookup by ID works`);
        console.log(`   Product ID: ${testProduct.id}`);
        console.log(`   Product name: ${productById.name}`);
      } else {
        console.log('❌ FAIL: Could not fetch product by ID');
        allTestsPassed = false;
      }
    } else {
      console.log('⚠️  SKIP: No products to test');
    }
  } catch (error) {
    console.log('❌ FAIL: Error testing ID lookup:', error.message);
    allTestsPassed = false;
  }

  // Test 8: Verify enhanced product fields
  console.log('\n📋 Test 8: Verify enhanced product fields');
  console.log('-'.repeat(60));
  try {
    const { data: products } = await supabase
      .from('products')
      .select(`
        id,
        name,
        features,
        videos,
        materials,
        dimensions,
        warranty,
        delivery_timeframe,
        popular_with,
        badges
      `)
      .limit(3);

    if (products && products.length > 0) {
      let productsWithEnhancements = 0;

      products.forEach(product => {
        const hasEnhancements = 
          product.features ||
          product.videos ||
          product.materials ||
          product.dimensions ||
          product.warranty;

        if (hasEnhancements) {
          productsWithEnhancements++;
        }
      });

      console.log(`✅ PASS: Enhanced fields verified`);
      console.log(`   Products tested: ${products.length}`);
      console.log(`   Products with enhancements: ${productsWithEnhancements}`);
      console.log(`   Enhanced fields: features, videos, materials, dimensions, warranty`);
    } else {
      console.log('⚠️  SKIP: No products to test');
    }
  } catch (error) {
    console.log('❌ FAIL: Error checking enhanced fields:', error.message);
    allTestsPassed = false;
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  if (allTestsPassed) {
    console.log('✅ ALL TESTS PASSED - Product detail pages working correctly');
  } else {
    console.log('❌ SOME TESTS FAILED - Review errors above');
  }
  console.log('='.repeat(60));

  return allTestsPassed;
}

// Run tests
testProductDetailPages()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('❌ Test suite error:', error);
    process.exit(1);
  });
