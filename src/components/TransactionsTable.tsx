import type { UiPaymentRow } from '../types/payments'
import { formatDateTimeForUi, formatMethodLabel } from '../utils/normalization'

interface TransactionsTableProps {
  payments: UiPaymentRow[]
  loading: boolean
  error: string | null
  selectedId: string | null
  onSelect: (paymentId: string) => void
  page: number
  pageSize: number
}

export function TransactionsTable({
  payments,
  loading,
  error,
  selectedId,
  onSelect,
  page,
  pageSize,
}: TransactionsTableProps) {
  if (loading) {
    return <div className="table-placeholder">Loading payments…</div>
  }

  if (error) {
    return <div className="alert error">Error: {error}</div>
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Payment ID</th>
            <th>Created</th>
            <th>Customer</th>
            <th>Method</th>
            <th>Blockchain</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Error</th>
          </tr>
        </thead>
        <tbody>
          {payments.length === 0 ? (
            <tr>
              <td colSpan={8} style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                No payments match the current filters.
              </td>
            </tr>
          ) : (
            payments.map((payment, index) => {
              const displayIndex = (page - 1) * pageSize + index + 1
              return (
              <tr
                key={payment.id}
                className={`selectable ${payment.id === selectedId ? 'selected' : ''}`}
                onClick={() => onSelect(payment.id)}
              >
                  <td className="mono index-cell">{displayIndex}</td>
                  <td className="mono">{payment.id}</td>
                  <td>{formatDateTimeForUi(payment.createdAt)}</td>
                  <td>{payment.customerLabel}</td>
                  <td>{formatMethodLabel(payment.method)}</td>
                  <td className="capitalize">
                    {payment.blockchain ? payment.blockchain : '—'}
                  </td>
                  <td>{payment.amountLabel}</td>
                  <td>
                    {payment.normalizedStatus}
                    {payment.rawStatus ? (
                      <div className="secondary-text">{payment.rawStatus}</div>
                    ) : null}
                  </td>
                  <td>{payment.errorMessage || '—'}</td>
              </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}

