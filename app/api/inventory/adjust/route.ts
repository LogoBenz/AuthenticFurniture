import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface StockAdjustment {
  warehouse_id: string;
  product_id: string;
  type: 'add' | 'remove' | 'set';
  quantity: number;
  reason: string;
  notes?: string;
  adjusted_by?: string;
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Stock adjustment API called');
    
    const body: StockAdjustment = await request.json();
    console.log('📊 Request body:', body);
    
    const { warehouse_id, product_id, type, quantity, reason, notes, adjusted_by } = body;

    // Validate required fields
    if (!warehouse_id || !product_id || !type || !quantity || !reason) {
      console.error('❌ Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields: warehouse_id, product_id, type, quantity, and reason are required' },
        { status: 400 }
      );
    }

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Supabase not configured');
      return NextResponse.json({ 
        error: 'Supabase not configured. Please check your environment variables.' 
      }, { status: 503 });
    }

    // Validate quantity
    if (quantity <= 0) {
      return NextResponse.json(
        { error: 'Quantity must be a positive number' },
        { status: 400 }
      );
    }

    // Get current stock
    const { data: currentStock, error: fetchError } = await supabase
      .from('warehouse_products')
      .select('stock_quantity')
      .eq('warehouse_id', warehouse_id)
      .eq('product_id', product_id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching current stock:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch current stock' },
        { status: 500 }
      );
    }

    const currentQuantity = currentStock?.stock_quantity || 0;

    // Calculate new quantity based on adjustment type
    let newQuantity: number;
    switch (type) {
      case 'add':
        newQuantity = currentQuantity + quantity;
        break;
      case 'remove':
        if (quantity > currentQuantity) {
          return NextResponse.json(
            { error: 'Cannot remove more stock than available' },
            { status: 400 }
          );
        }
        newQuantity = currentQuantity - quantity;
        break;
      case 'set':
        newQuantity = quantity;
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid adjustment type' },
          { status: 400 }
        );
    }

    // Ensure stock cannot go negative
    if (newQuantity < 0) {
      return NextResponse.json(
        { error: 'Stock cannot be negative' },
        { status: 400 }
      );
    }

    // Start transaction
    const { data: adjustmentData, error: adjustmentError } = await supabase
      .from('stock_adjustments')
      .insert({
        warehouse_id,
        product_id,
        adjustment_type: type,
        quantity,
        previous_quantity: currentQuantity,
        new_quantity: newQuantity,
        reason,
        notes: notes || null,
        adjusted_by: adjusted_by || 'admin',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (adjustmentError) {
      console.error('Error creating stock adjustment record:', adjustmentError);
      return NextResponse.json(
        { error: 'Failed to create adjustment record' },
        { status: 500 }
      );
    }

    // Update warehouse stock
    const { error: updateError } = await supabase
      .from('warehouse_products')
      .upsert({
        warehouse_id,
        product_id,
        stock_quantity: newQuantity,
        last_updated: new Date().toISOString()
      }, {
        onConflict: 'warehouse_id,product_id'
      });

    if (updateError) {
      console.error('Error updating warehouse stock:', updateError);
      return NextResponse.json(
        { error: 'Failed to update stock' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      adjustment: adjustmentData,
      previous_quantity: currentQuantity,
      new_quantity: newQuantity,
      message: 'Stock adjusted successfully'
    });

  } catch (error) {
    console.error('Error in stock adjustment API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get stock adjustment history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const warehouse_id = searchParams.get('warehouse_id');
    const product_id = searchParams.get('product_id');
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = supabase
      .from('stock_adjustments')
      .select(`
        *,
        products (name, model_no),
        warehouses (name)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (warehouse_id) {
      query = query.eq('warehouse_id', warehouse_id);
    }

    if (product_id) {
      query = query.eq('product_id', product_id);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching stock adjustments:', error);
      return NextResponse.json(
        { error: 'Failed to fetch stock adjustments' },
        { status: 500 }
      );
    }

    return NextResponse.json({ adjustments: data || [] });

  } catch (error) {
    console.error('Error in stock adjustments GET API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
