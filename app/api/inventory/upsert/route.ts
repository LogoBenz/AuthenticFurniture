import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    console.log('🔄 Inventory upsert API called');
    
    const body = await req.json();
    console.log('📊 Request body:', body);
    
    const entries = (body?.entries || []) as Array<{ warehouse_id: string; product_id: string; stock_count: number }>;
    if (!Array.isArray(entries) || entries.length === 0) {
      console.error('❌ No entries provided');
      return NextResponse.json({ error: 'No entries provided' }, { status: 400 });
    }

    console.log('📝 Upserting entries:', entries);

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Supabase not configured');
      return NextResponse.json({ 
        error: 'Supabase not configured. Please check your environment variables.' 
      }, { status: 503 });
    }

    const { data, error } = await supabase
      .from('warehouse_products')
      .upsert(entries.map(entry => ({
        warehouse_id: entry.warehouse_id,
        product_id: entry.product_id,
        stock_quantity: entry.stock_count,
        last_updated: new Date().toISOString()
      })), { 
        onConflict: 'warehouse_id,product_id' 
      })
      .select();

    if (error) {
      console.error('❌ Supabase upsert error:', error);
      return NextResponse.json({ 
        error: `Database error: ${error.message}`,
        details: error 
      }, { status: 500 });
    }

    console.log('✅ Upsert successful:', data);
    return NextResponse.json({ 
      ok: true, 
      data,
      message: 'Inventory updated successfully' 
    });
  } catch (e: any) {
    console.error('❌ API error:', e);
    return NextResponse.json({ 
      error: e?.message || 'Unknown error',
      details: e 
    }, { status: 500 });
  }
}

