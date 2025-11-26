import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Validate webhook secret
    const authHeader = request.headers.get('authorization')
    const secret = process.env.SUPABASE_WEBHOOK_SECRET

    if (!secret) {
      console.error('SUPABASE_WEBHOOK_SECRET not configured')
      return NextResponse.json(
        { error: 'Webhook not configured' },
        { status: 500 }
      )
    }

    if (authHeader !== `Bearer ${secret}`) {
      console.error('Invalid webhook secret')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse webhook payload
    const body = await request.json()
    const { type, record, old_record } = body

    console.log('Revalidation webhook triggered:', {
      type,
      productId: record?.id,
      productSlug: record?.slug
    })

    // Revalidate products listing page
    revalidatePath('/products')
    revalidateTag('products')

    // Revalidate specific product page if slug is available
    if (record?.slug) {
      revalidatePath(`/products/${record.slug}`)
      console.log(`Revalidated /products/${record.slug}`)
    }

    // If slug changed, revalidate old slug too
    if (type === 'UPDATE' && old_record?.slug && old_record.slug !== record?.slug) {
      revalidatePath(`/products/${old_record.slug}`)
      console.log(`Revalidated old slug: /products/${old_record.slug}`)
    }

    // Revalidate home page if featured products changed
    if (record?.is_featured || old_record?.is_featured) {
      revalidatePath('/')
      console.log('Revalidated home page (featured products changed)')
    }

    // Revalidate home page if featured deals changed
    if (record?.is_featured_deal || old_record?.is_featured_deal) {
      revalidatePath('/')
      console.log('Revalidated home page (featured deals changed)')
    }

    return NextResponse.json({
      revalidated: true,
      timestamp: new Date().toISOString(),
      paths: [
        '/products',
        record?.slug ? `/products/${record.slug}` : null,
        (record?.is_featured || record?.is_featured_deal) ? '/' : null
      ].filter(Boolean)
    })
  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json(
      {
        error: 'Revalidation failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
