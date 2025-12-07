import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/products';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');

        if (!query) {
            return NextResponse.json({ products: [] });
        }

        const { products } = await getProducts({
            limit: 6,
            search: query
        });

        return NextResponse.json({ products });
    } catch (error) {
        console.error('❌ Search API Error:', error);
        return NextResponse.json({ error: 'Failed to search products' }, { status: 500 });
    }
}
