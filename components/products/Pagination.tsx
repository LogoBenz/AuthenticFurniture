'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
  searchParams: Record<string, string | undefined>
}

export default function Pagination({
  currentPage,
  totalPages,
  baseUrl,
  searchParams
}: PaginationProps) {
  const router = useRouter()

  // Create URL with page parameter while preserving all other search params
  const createPageUrl = (page: number): string => {
    const params = new URLSearchParams()
    
    // Add all existing search params
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined && key !== 'page') {
        params.set(key, value)
      }
    })
    
    // Add the page parameter
    params.set('page', page.toString())
    
    return `${baseUrl}?${params.toString()}`
  }

  // Navigate to a specific page
  const goToPage = (page: number) => {
    router.push(createPageUrl(page))
  }

  // Calculate which page numbers to show (max 7 pages)
  const getPageNumbers = (): number[] => {
    const maxPagesToShow = 7
    const pages: number[] = []

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      // Calculate range around current page
      let startPage = Math.max(2, currentPage - 2)
      let endPage = Math.min(totalPages - 1, currentPage + 2)

      // Adjust range if at the beginning or end
      if (currentPage <= 3) {
        endPage = 5
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - 4
      }

      // Add ellipsis if needed
      if (startPage > 2) {
        pages.push(-1) // -1 represents ellipsis
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }

      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pages.push(-1) // -1 represents ellipsis
      }

      // Always show last page
      pages.push(totalPages)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* Previous Button */}
      <Button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        variant="outline"
        size="sm"
      >
        Previous
      </Button>

      {/* Page Number Buttons */}
      {pageNumbers.map((page, index) => {
        if (page === -1) {
          // Render ellipsis
          return (
            <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
              ...
            </span>
          )
        }

        return (
          <Button
            key={page}
            onClick={() => goToPage(page)}
            variant={page === currentPage ? 'default' : 'outline'}
            size="sm"
            className="min-w-[40px]"
          >
            {page}
          </Button>
        )
      })}

      {/* Next Button */}
      <Button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        variant="outline"
        size="sm"
      >
        Next
      </Button>
    </div>
  )
}
