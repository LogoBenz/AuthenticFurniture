'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function ProductError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Product page error:', error)
  }, [error])

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center py-16">
          <div className="mb-6">
            <svg
              className="mx-auto h-16 w-16 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Something went wrong!
          </h2>
          
          <p className="text-lg text-gray-600 mb-8">
            We encountered an error while loading this product. This could be due to a temporary issue with our servers.
          </p>
          
          {error.message && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800 font-mono">
                {error.message}
              </p>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={reset}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3"
            >
              Try again
            </Button>
            
            <Button
              onClick={() => window.location.href = '/products'}
              variant="outline"
              className="px-8 py-3"
            >
              Browse all products
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
