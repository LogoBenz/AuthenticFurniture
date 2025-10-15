/**
 * Script to sync inventory records for all products
 * This creates inventory entries for products that don't have any
 */

import { supabase } from '../lib/supabase-simple';

async function syncInventory() {
  console.log('🔄 Starting inventory sync...');

  try {
    // Get all products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name');

    if (productsError) {
      console.error('❌ Error fetching products:', productsError);
      return;
    }

    console.log(`📦 Found ${products?.length || 0} total products`);

    // Get all existing inventory records
    const { data: inventory, error: inventoryError } = await supabase
      .from('inventory')
      .select('product_id');

    if (inventoryError) {
      console.error('❌ Error fetching inventory:', inventoryError);
      return;
    }

    const productsWithInventory = new Set(inventory?.map(i => i.product_id) || []);
    console.log(`📊 Found ${productsWithInventory.size} products with inventory`);

    // Find products without inventory
    const productsWithoutInventory = products?.filter(p => !productsWithInventory.has(p.id)) || [];
    console.log(`⚠️  Found ${productsWithoutInventory.length} products without inventory`);

    if (productsWithoutInventory.length === 0) {
      console.log('✅ All products have inventory records!');
      return;
    }

    // Get the first warehouse (or create a default one)
    const { data: warehouses, error: warehouseError } = await supabase
      .from('warehouses')
      .select('id, name')
      .limit(1);

    if (warehouseError || !warehouses || warehouses.length === 0) {
      console.error('❌ No warehouses found. Please create a warehouse first.');
      return;
    }

    const defaultWarehouse = warehouses[0];
    console.log(`🏢 Using warehouse: ${defaultWarehouse.name}`);

    // Create inventory records for products without them
    const inventoryRecords = productsWithoutInventory.map(product => ({
      product_id: product.id,
      warehouse_id: defaultWarehouse.id,
      stock_count: 0, // Start with 0 stock
      reserved_count: 0,
      reorder_level: 10,
      reorder_quantity: 50,
    }));

    const { data: created, error: createError } = await supabase
      .from('inventory')
      .insert(inventoryRecords)
      .select();

    if (createError) {
      console.error('❌ Error creating inventory records:', createError);
      return;
    }

    console.log(`✅ Created ${created?.length || 0} inventory records`);
    console.log('🎉 Inventory sync complete!');

    // Show summary
    console.log('\n📋 Summary:');
    console.log(`   Total products: ${products?.length || 0}`);
    console.log(`   Products with inventory before: ${productsWithInventory.size}`);
    console.log(`   Products with inventory after: ${(products?.length || 0)}`);
    console.log(`   New inventory records created: ${created?.length || 0}`);

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the script
syncInventory();
