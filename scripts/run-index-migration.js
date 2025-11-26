/**
 * Script to run the product indexes migration
 * Run with: node scripts/run-index-migration.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  console.log('🔧 Running product indexes migration...\n');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error('❌ Missing environment variables');
    return;
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  // Read the migration file
  const migrationPath = path.join(__dirname, '../supabase/migrations/add_product_indexes.sql');
  const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

  console.log('📄 Migration file loaded');
  console.log('📊 Creating indexes...\n');

  try {
    // Execute the migration
    const { data, error } = await supabase.rpc('exec_sql', { sql: migrationSQL });

    if (error) {
      // If exec_sql doesn't exist, try direct execution (this might not work in all cases)
      console.log('⚠️  exec_sql function not available, trying alternative method...\n');
      
      // Split by semicolon and execute each statement
      const statements = migrationSQL
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('COMMENT'));

      for (const statement of statements) {
        console.log('Executing:', statement.substring(0, 60) + '...');
        // Note: This won't work with Supabase client directly
        // You'll need to run this in the Supabase SQL Editor
      }

      console.log('\n⚠️  Please run this migration manually in Supabase SQL Editor:');
      console.log('1. Go to https://supabase.com/dashboard');
      console.log('2. Select your project');
      console.log('3. Go to SQL Editor');
      console.log('4. Copy and paste the contents of: supabase/migrations/add_product_indexes.sql');
      console.log('5. Click "Run"\n');
      
      return;
    }

    console.log('✅ Migration completed successfully!\n');
    console.log('📊 Indexes created:');
    console.log('   - idx_products_subcategory');
    console.log('   - idx_products_space');
    console.log('   - idx_products_price');
    console.log('   - idx_products_slug');
    console.log('   - idx_products_in_stock');
    console.log('   - idx_products_created_at');
    console.log('   - idx_products_space_subcategory (composite)');
    console.log('   - idx_products_space_price (composite)');
    console.log('   - idx_products_subcategory_price (composite)');
    console.log('   - idx_products_in_stock_created_at (composite)');
    console.log('   - idx_products_is_featured');
    console.log('   - idx_products_name_search (full-text)');
    console.log('   - idx_products_description_search (full-text)\n');

  } catch (error) {
    console.error('❌ Error running migration:', error.message);
    console.log('\n📝 Manual migration required:');
    console.log('Please run the SQL in supabase/migrations/add_product_indexes.sql');
    console.log('in the Supabase SQL Editor.\n');
  }
}

runMigration();
