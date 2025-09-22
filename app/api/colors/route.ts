import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/colors - Get all color options
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('color_options')
      .select('*')
      .order('display_order', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching colors:', error);
      return NextResponse.json(
        { error: 'Failed to fetch colors' },
        { status: 500 }
      );
    }

    return NextResponse.json({ colors: data || [] });
  } catch (error) {
    console.error('Error in colors API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/colors - Create new color option
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, hex_code, display_order } = body;

    if (!name || !hex_code) {
      return NextResponse.json(
        { error: 'Name and hex_code are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('color_options')
      .insert({
        name,
        hex_code,
        display_order: display_order || 0
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating color:', error);
      return NextResponse.json(
        { error: 'Failed to create color' },
        { status: 500 }
      );
    }

    return NextResponse.json({ color: data }, { status: 201 });
  } catch (error) {
    console.error('Error in colors POST API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
