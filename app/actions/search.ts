'use server'

import { searchProducts } from '@/lib/products'
import { Product } from '@/types'

/**
 * Server action for searching products
 * This function runs on the server and can be called from client components
 * 
 * @param query - Search query string
 * @returns Promise<Product[]> - Array of matching products (limited to 10)
 */
export async function searchProductsAction(query: string): Promise<Product[]> {
  console.log('🔍 Server action: searchProductsAction called with query:', query)
  
  try {
    // Call the server-side cached searchProducts function
    const results = await searchProducts(query)
    
    console.log('✅ Server action: Found', results.length, 'products')
    
    // Return serializable product data
    return results
  } catch (error) {
    console.error('❌ Server action: Error searching products:', error)
    // Return empty array on error
    return []
  }
}
