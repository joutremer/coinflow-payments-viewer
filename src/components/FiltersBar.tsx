import type { ChangeEvent } from 'react'
import type { PaymentsFilterState } from '../hooks/usePayments'

interface FiltersBarProps {
  filters: PaymentsFilterState
  onChange: (next: Partial<PaymentsFilterState>) => void
}

const statusOptions: Array<{ value: PaymentsFilterState['status']; label: string }> =
  [
    { value: 'all', label: 'All statuses' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'FAILED', label: 'Failed' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'OTHER', label: 'Other' },
  ]

const methodOptions: Array<{ value: PaymentsFilterState['method']; label: string }> =
  [
    { value: 'all', label: 'All methods' },
    { value: 'card', label: 'Card' },
    { value: 'bank_transfer', label: 'Bank transfer' },
    { value: 'pix', label: 'Pix' },
    { value: 'iban', label: 'IBAN' },
    { value: 'wire', label: 'Wire' },
    { value: 'crypto', label: 'Crypto' },
    { value: 'instant', label: 'Instant' },
    { value: 'unknown', label: 'Unknown' },
  ]

const blockchainOptions: Array<{
  value: PaymentsFilterState['blockchain']
  label: string
}> = [
  { value: 'all', label: 'All blockchains' },
  { value: 'solana', label: 'Solana' },
  { value: 'eth', label: 'Ethereum' },
  { value: 'polygon', label: 'Polygon' },
  { value: 'base', label: 'Base' },
  { value: 'user', label: 'User' },
  { value: 'xion', label: 'Xion' },
  { value: 'arbitrum', label: 'Arbitrum' },
  { value: 'unknown', label: 'Unknown' },
]

export function FiltersBar({ filters, onChange }: FiltersBarProps) {
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({ search: event.target.value })
  }

  const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange({ status: event.target.value as PaymentsFilterState['status'] })
  }

  const handleMethodChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange({ method: event.target.value as PaymentsFilterState['method'] })
  }

  const handleBlockchainChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange({
      blockchain: event.target.value as PaymentsFilterState['blockchain'],
    })
  }

  const handleSinceChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({ since: event.target.value })
  }

  const handleUntilChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({ until: event.target.value })
  }

  const handleReset = () => {
    onChange({
      search: '',
      status: 'all',
      method: 'all',
      blockchain: 'all',
      since: '',
      until: '',
      page: 1,
    })
  }

  return (
    <section className="filters-bar">
      <div className="filters-group">
        <label className="filters-field grow">
          <span>Search</span>
          <input
            type="search"
            placeholder="Search by id, customer, or error"
            value={filters.search}
            onChange={handleSearchChange}
          />
        </label>

        <label className="filters-field">
          <span>Status</span>
          <select value={filters.status} onChange={handleStatusChange}>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="filters-field">
          <span>Method</span>
          <select value={filters.method} onChange={handleMethodChange}>
            {methodOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="filters-field">
          <span>Blockchain</span>
          <select value={filters.blockchain} onChange={handleBlockchainChange}>
            {blockchainOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="filters-field">
          <span>Since</span>
          <input type="date" value={filters.since} onChange={handleSinceChange} />
        </label>

        <label className="filters-field">
          <span>Until</span>
          <input type="date" value={filters.until} onChange={handleUntilChange} />
        </label>
      </div>

      <div className="filters-actions">
        <button type="button" onClick={handleReset} className="secondary">
          Reset
        </button>
      </div>
    </section>
  )
}

