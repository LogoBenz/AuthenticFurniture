"use server";

import { NextResponse } from 'next/server';
import { getAllSpaces } from '@/lib/categories';
import { getFeaturedDeals, getFeaturedProducts } from '@/lib/products';

export async function GET() {
    try {
        const [popularCategories, dealsOfWeek, newArrivals] = await Promise.all([
            getAllSpaces().catch((e) => {
                console.error('Error fetching popular categories:', e);
                return null;
            }),
            getFeaturedDeals().catch((e) => {
                console.error('Error fetching deals of the week:', e);
                return null;
            }),
            getFeaturedProducts().catch((e) => {
                console.error('Error fetching new arrivals:', e);
                return null;
            }),
        ]);

        // If all failed, we might want to return an error, but the spec says:
        // "If one call fails, set only that key to null. Do not throw unless ALL three fail."
        if (!popularCategories && !dealsOfWeek && !newArrivals) {
            return NextResponse.json(
                { error: 'All sections failed to load' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            popularCategories,
            dealsOfWeek,
            newArrivals,
        });
    } catch (error) {
        console.error('Unexpected error in home-sections endpoint:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
