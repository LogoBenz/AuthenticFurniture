'use server'

/**
 * Server action to trigger revalidation after product CRUD operations
 * This keeps the webhook secret secure on the server side
 */
export async function triggerProductRevalidation(
  type: 'INSERT' | 'UPDATE' | 'DELETE',
  record: any,
  old_record?: any
) {
  try {
    const webhookSecret = process.env.SUPABASE_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      console.error('SUPABASE_WEBHOOK_SECRET not configured');
      return { success: false, error: 'Webhook secret not configured' };
    }

    // Determine the base URL for the API call
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const response = await fetch(`${baseUrl}/api/revalidate-products`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${webhookSecret}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type,
        record,
        old_record
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Revalidation failed:', errorText);
      return { success: false, error: errorText };
    }

    const result = await response.json();
    console.log('✅ Revalidation successful:', result);
    return { success: true, data: result };
  } catch (error) {
    console.error('❌ Error triggering revalidation:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
