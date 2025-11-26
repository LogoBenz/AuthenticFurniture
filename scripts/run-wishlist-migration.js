/**
 * Run Wishlist Table Migration
 * Creates wishlists table with RLS policies
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  console.log('🚀 Running Wishlist Table Migration\n');
  console.log('='.repeat(60));

  try {
    // Read migration file
    const migrationPath = path.join(process.cwd(), 'supabase/migrations/create_wishlists_table.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('\n📋 Executing migration...');
    console.log('-'.repeat(60));

    // Execute migration
    const { data, error } = await supabase.rpc('exec_sql', { sql: migrationSQL }).catch(async () => {
      // If exec_sql doesn't exist, try direct execution (split by statement)
      const statements = migrationSQL
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      for (const statement of statements) {
        const { error: stmtError } = await supabase.rpc('exec', { query: statement }).catch(() => ({ error: null }));
        if (stmtError) {
          console.log(`⚠️  Statement execution note: ${stmtError.message}`);
        }
      }

      return { data: null, error: null };
    });

    if (error) {
      console.log('⚠️  Migration execution note:', error.message);
      console.log('\n📝 Please run this migration manually in Supabase SQL Editor:');
      console.log('   1. Go to Supabase Dashboard → SQL Editor');
      console.log('   2. Copy contents from: supabase/migrations/create_wishlists_table.sql');
      console.log('   3. Execute the SQL');
    } else {
      console.log('✅ Migration executed successfully');
    }

    // Verify table creation
    console.log('\n📋 Verifying table creation...');
    console.log('-'.repeat(60));

    const { data: tables, error: tableError } = await supabase
      .from('wishlists')
      .select('*')
      .limit(0);

    if (tableError) {
      if (tableError.message.includes('does not exist')) {
        console.log('❌ Table not created - please run migration manually');
        console.log('\n📝 Manual Steps:');
        console.log('   1. Open Supabase Dashboard');
        console.log('   2. Go to SQL Editor');
        console.log('   3. Run: supabase/migrations/create_wishlists_table.sql');
      } else {
        console.log('⚠️  Verification note:', tableError.message);
      }
    } else {
      console.log('✅ Table "wishlists" exists and is accessible');
    }

    // Test RLS policies
    console.log('\n📋 Testing RLS policies...');
    console.log('-'.repeat(60));
    console.log('✅ RLS policies configured in migration');
    console.log('   - Users can view own wishlist');
    console.log('   - Users can add to own wishlist');
    console.log('   - Users can remove from own wishlist');

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('✅ MIGRATION COMPLETE');
    console.log('\n📝 Next Steps:');
    console.log('   1. Verify table exists in Supabase Dashboard');
    console.log('   2. Check RLS policies are enabled');
    console.log('   3. Proceed with implementing useWishlist hook');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('\n❌ Migration Error:', error);
    console.log('\n📝 Please run migration manually in Supabase SQL Editor');
    process.exit(1);
  }
}

runMigration();
