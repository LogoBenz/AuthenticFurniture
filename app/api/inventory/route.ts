import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PUT(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();

    const entries = (body?.entries || []) as Array<{ warehouse_id: string; product_id: string; stock_count: number }>;
    if (!Array.isArray(entries) || entries.length === 0) {
      return NextResponse.json({ error: 'No entries provided' }, { status: 400 });
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


