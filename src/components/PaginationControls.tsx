interface PaginationControlsProps {
  page: number
  pageSize: number
  hasNextPage: boolean
  totalOnPage: number
  onPageChange: (page: number) => void
  isLoading: boolean
}

export function PaginationControls({
  page,
  pageSize,
  hasNextPage,
  totalOnPage,
  onPageChange,
  isLoading,
}: PaginationControlsProps) {
  const start = totalOnPage === 0 ? 0 : (page - 1) * pageSize + 1
  const end = (page - 1) * pageSize + totalOnPage

  const handlePrev = () => {
    if (page > 1) {
      onPageChange(page - 1)
    }
  }

  const handleNext = () => {
    if (hasNextPage) {
      onPageChange(page + 1)
    }
  }

  return (
    <div className="pagination-bar">
      <div className="pagination-summary">
        Showing {start}-{end} {totalOnPage === 1 ? 'payment' : 'payments'}
      </div>

      <div className="pagination-actions">
        <button
          type="button"
          className="secondary"
          onClick={handlePrev}
          disabled={page <= 1 || isLoading}
        >
          Previous
        </button>
        <span className="pagination-page">Page {page}</span>
        <button
          type="button"
          className="secondary"
          onClick={handleNext}
          disabled={!hasNextPage || isLoading}
        >
          Next
        </button>
      </div>
    </div>
  )
}

