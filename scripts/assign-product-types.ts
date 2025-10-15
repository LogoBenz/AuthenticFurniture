/**
 * Script to assign product types to existing products
 * Run with: npx tsx scripts/assign-product-types.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Manually load .env.local file
function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  
  console.log('🔍 Looking for .env.local at:', envPath);
  
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env.local file not found at:', envPath);
    process.exit(1);
  }

  console.log('✅ Found .env.local file');

  const envContent = fs.readFileSync(envPath, 'utf-8');
  const lines = envContent.split('\n');

  let loaded = 0;
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim();
        process.env[key.trim()] = value;
        loaded++;
        console.log(`   Loaded: ${key.trim()}`);
      }
    }
  }
  
  console.log(`✅ Loaded ${loaded} environment variables\n`);
}

// Load environment variables
loadEnvFile();

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓ Found' : '✗ Missing');
  console.error('   NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? '✓ Found' : '✗ Missing');
  console.error('\n   Make sure .env.local exists in your project root with:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL=your-url');
  console.error('   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key');
  process.exit(1);
}

console.log('✅ Supabase credentials loaded successfully');
console.log(`   URL: ${supabaseUrl.substring(0, 30)}...`);
console.log('');

const supabase = createClient(supabaseUrl, supabaseKey);

// Product type assignment rules
const TYPE_RULES = [
  {
    type: 'Executive Tables',
    keywords: ['executive', 'ceo', 'director', 'manager'],
  },
  {
    type: 'Electric Desks',
    keywords: ['electric', 'adjustable', 'standing', 'height-adjustable'],
  },
  {
    type: 'Reception Tables',
    keywords: ['reception', 'front desk', 'lobby'],
  },
  {
    type: 'Conference Tables',
    keywords: ['conference', 'meeting', 'boardroom'],
  },
];

async function assignProductTypes() {
  console.log('🚀 Starting product type assignment...\n');

  try {
    // Get office tables subcategory
    const { data: subcategory, error: subError } = await supabase
      .from('subcategories')
      .select('id, name')
      .eq('slug', 'office-tables')
      .single();

    if (subError || !subcategory) {
      console.error('❌ Could not find office-tables subcategory');
      console.error('   Make sure you have a subcategory with slug "office-tables"');
      return;
    }

    console.log(`✅ Found subcategory: ${subcategory.name} (${subcategory.id})\n`);

    // Get all products in this subcategory
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, product_type')
      .eq('subcategory_id', subcategory.id);

    if (productsError || !products) {
      console.error('❌ Error fetching products:', productsError);
      return;
    }

    console.log(`📦 Found ${products.length} products to process\n`);

    if (products.length === 0) {
      console.log('ℹ️  No products found in office-tables subcategory');
      console.log('   Add some products first, then run this script again');
      return;
    }

    let updated = 0;
    let skipped = 0;

    // Process each product
    for (const product of products) {
      // Skip if already has a product type
      if (product.product_type) {
        console.log(`⏭️  Skipped: ${product.name} (already has type: ${product.product_type})`);
        skipped++;
        continue;
      }

      const name = product.name.toLowerCase();
      let assignedType = 'Standard Tables'; // Default type

      // Check against rules
      for (const rule of TYPE_RULES) {
        if (rule.keywords.some(keyword => name.includes(keyword))) {
          assignedType = rule.type;
          break;
        }
      }

      // Update the product
      const { error: updateError } = await supabase
        .from('products')
        .update({ product_type: assignedType })
        .eq('id', product.id);

      if (updateError) {
        console.error(`❌ Error updating ${product.name}:`, updateError.message);
      } else {
        console.log(`✅ Updated: ${product.name} → ${assignedType}`);
        updated++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 Summary:');
    console.log(`   Total products: ${products.length}`);
    console.log(`   Updated: ${updated}`);
    console.log(`   Skipped (already had type): ${skipped}`);
    console.log('='.repeat(60));
    console.log('\n✅ Product type assignment complete!');
    console.log('\nℹ️  Next steps:');
    console.log('   1. Review the assignments in Supabase Dashboard');
    console.log('   2. Manually adjust any incorrect assignments');
    console.log('   3. View the Office Tables section on your website');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the script
assignProductTypes();
