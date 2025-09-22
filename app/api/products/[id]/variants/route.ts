import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/products/[id]/variants - Get variants for a product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);
    
    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('product_variants')
      .select('*')
      .eq('product_id', productId)
      .order('display_order', { ascending: true })
      .order('color_name', { ascending: true });

    if (error) {
      console.error('Error fetching product variants:', error);
      return NextResponse.json(
        { error: 'Failed to fetch product variants' },
        { status: 500 }
      );
    }

    return NextResponse.json({ variants: data || [] });
  } catch (error) {
    console.error('Error in product variants API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/products/[id]/variants - Create variants for a product
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);
    
    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { variants } = body;

    if (!Array.isArray(variants)) {
      return NextResponse.json(
        { error: 'Variants must be an array' },
        { status: 400 }
      );
    }

    // Prepare variants data
    const variantsData = variants.map((variant: any) => ({
      product_id: productId,
      color_id: variant.color_id,
      color_name: variant.color_name,
      color_hex: variant.color_hex,
      images: variant.images || [],
      price: variant.price || null,
      sku: variant.sku || null,
      is_available: variant.is_available !== false,
      display_order: variant.display_order || 0
    }));

    const { data, error } = await supabase
      .from('product_variants')
      .insert(variantsData)
      .select();

    if (error) {
      console.error('Error creating product variants:', error);
      return NextResponse.json(
        { error: 'Failed to create product variants' },
        { status: 500 }
      );
    }

    return NextResponse.json({ variants: data }, { status: 201 });
  } catch (error) {
    console.error('Error in product variants POST API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id]/variants - Update variants for a product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);
    
    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { variants } = body;

    if (!Array.isArray(variants)) {
      return NextResponse.json(
        { error: 'Variants must be an array' },
        { status: 400 }
      );
    }

    // Update each variant
    const updatePromises = variants.map(async (variant: any) => {
      const { data, error } = await supabase
        .from('product_variants')
        .update({
          color_name: variant.color_name,
          color_hex: variant.color_hex,
          images: variant.images || [],
          price: variant.price || null,
          sku: variant.sku || null,
          is_available: variant.is_available !== false,
          display_order: variant.display_order || 0
        })
        .eq('id', variant.id)
        .eq('product_id', productId)
        .select();

      if (error) {
        console.error('Error updating variant:', error);
        throw error;
      }

      return data;
    });

    const results = await Promise.all(updatePromises);

    return NextResponse.json({ 
      variants: results.flat(),
      message: 'Variants updated successfully' 
    });
  } catch (error) {
    console.error('Error in product variants PUT API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id]/variants - Delete all variants for a product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);
    
    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('product_variants')
      .delete()
      .eq('product_id', productId);

    if (error) {
      console.error('Error deleting product variants:', error);
      return NextResponse.json(
        { error: 'Failed to delete product variants' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: 'Product variants deleted successfully' 
    });
  } catch (error) {
    console.error('Error in product variants DELETE API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
