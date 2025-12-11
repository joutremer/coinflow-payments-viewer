import { useEffect, useMemo, useState } from 'react'
import { FiltersBar } from './components/FiltersBar'
import { TransactionsTable } from './components/TransactionsTable'
import { usePayments, type PaymentsFilterState } from './hooks/usePayments'
import { PaymentDetailsPanel } from './components/PaymentDetailsPanel'
import { usePaymentDetails } from './hooks/usePaymentDetails'
import { PaginationControls } from './components/PaginationControls'

function App() {
  const [filters, setFilters] = useState<PaymentsFilterState>({
    search: '',
    status: 'all',
    method: 'all',
    blockchain: 'all',
    since: '',
    until: '',
    page: 1,
  })

  const { payments, loading, error, pageSize, hasNextPage } = usePayments(filters)
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null)

  useEffect(() => {
    if (payments.length === 0) {
      setSelectedPaymentId(null)
      return
    }

    setSelectedPaymentId((current) =>
      current && payments.some((payment) => payment.id === current)
        ? current
        : payments[0].id,
    )
  }, [payments])

  const { details, loading: detailsLoading, error: detailsError } =
    usePaymentDetails(selectedPaymentId)

  const selectedPayment = useMemo(
    () => payments.find((payment) => payment.id === selectedPaymentId) ?? null,
    [payments, selectedPaymentId],
  )

  const handleFilterChange = (next: Partial<PaymentsFilterState>) => {
    setFilters((prev) => ({
      ...prev,
      ...next,
      page: next.page ?? 1,
    }))
  }

  const handlePageChange = (page: number) => {
    handleFilterChange({ page })
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <img
          src="src/images/paysafe_logo.png"
          alt="Paysafe Logo"
          className="paysafe"
          width={200}
          height={200}
          style={{ objectFit: 'contain' }}/>
        <h1>Paysafe Payments Viewer</h1>
      </header>

      <main className="app-main">
        <FiltersBar filters={filters} onChange={handleFilterChange} />

        <PaymentDetailsPanel
          paymentId={selectedPayment?.id ?? null}
          details={details}
          loading={detailsLoading}
          error={detailsError}
        />


        <TransactionsTable
          payments={payments}
          loading={loading}
          error={error}
          selectedId={selectedPaymentId}
          onSelect={setSelectedPaymentId}
          page={filters.page}
          pageSize={pageSize}
        />

        
<PaginationControls
          page={filters.page}
          pageSize={pageSize}
          hasNextPage={hasNextPage}
          totalOnPage={payments.length}
          onPageChange={handlePageChange}
          isLoading={loading}
        />
        
      </main>
    </div>
  )
}

export default App

