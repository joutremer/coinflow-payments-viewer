import { useEffect, useMemo, useState } from 'react'
import { fetchPayments } from '../api/payments'
import { MOCK_PAYMENTS } from '../utils/mockData'
import { toUiRow } from '../utils/normalization'
import type {
  UiPaymentRow,
  NormalizedStatus,
  PaymentMethod,
  BlockchainNetwork,
} from '../types/payments'
import { COINFLOW_MERCHANT_ID } from '../config'

const PAGE_SIZE = 50
const SEARCH_LIMIT = 500

export interface PaymentsFilterState {
  search: string
  status: 'all' | NormalizedStatus
  method: 'all' | PaymentMethod
  blockchain: 'all' | BlockchainNetwork
  since: string
  until: string
  page: number
}

interface UsePaymentsResult {
  payments: UiPaymentRow[]
  loading: boolean
  error: string | null
  pageSize: number
  hasNextPage: boolean
}

function applyClientFilters(
  rows: UiPaymentRow[],
  filters: PaymentsFilterState,
): UiPaymentRow[] {
  const query = filters.search.trim().toLowerCase()
  const sinceMs = filters.since ? new Date(`${filters.since}T00:00:00Z`).getTime() : null
  const untilMs = filters.until ? new Date(`${filters.until}T23:59:59Z`).getTime() : null

  return rows.filter((row) => {
    const matchesSearch =
      !query ||
      row.id.toLowerCase().includes(query) ||
      row.customerLabel.toLowerCase().includes(query) ||
      (row.customerEmail ?? '').toLowerCase().includes(query) ||
      row.errorMessage.toLowerCase().includes(query)

    const matchesStatus =
      filters.status === 'all' || row.normalizedStatus === filters.status

    const matchesMethod =
      filters.method === 'all' || row.method === filters.method

    const matchesBlockchain =
      filters.blockchain === 'all' || row.blockchain === filters.blockchain

    const createdMs = new Date(row.createdAt).getTime()
    const matchesSince = sinceMs == null || createdMs >= sinceMs
    const matchesUntil = untilMs == null || createdMs <= untilMs

    return (
      matchesSearch &&
      matchesStatus &&
      matchesMethod &&
      matchesBlockchain &&
      matchesSince &&
      matchesUntil
    )
  })
}

export function usePayments(filters: PaymentsFilterState): UsePaymentsResult {
  const [rows, setRows] = useState<UiPaymentRow[]>(MOCK_PAYMENTS)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasNextPage, setHasNextPage] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      try {
        const trimmedSearch = filters.search.trim()
        const isSearching = trimmedSearch.length > 0
        const sinceMs = filters.since
          ? new Date(`${filters.since}T00:00:00Z`).getTime().toString()
          : undefined
        const untilMs = filters.until
          ? new Date(`${filters.until}T23:59:59Z`).getTime().toString()
          : undefined

        const apiResponse = await fetchPayments({
          search: isSearching ? undefined : trimmedSearch || undefined,
          status: filters.status === 'all' ? undefined : filters.status,
          method: filters.method === 'all' ? undefined : filters.method,
          blockchain: filters.blockchain === 'all' ? undefined : filters.blockchain,
          since: sinceMs,
          until: untilMs,
          merchantId: COINFLOW_MERCHANT_ID,
          page: isSearching ? 1 : filters.page,
          limit: isSearching ? SEARCH_LIMIT : PAGE_SIZE,
          sortBy: 'createdAt',
          sortDirection: -1,
        })

        if (cancelled) {
          return
        }

        const normalized = apiResponse.map(toUiRow)
        setRows(normalized)
        setHasNextPage(!isSearching && normalized.length === PAGE_SIZE)
      } catch (err) {
        if (cancelled) {
          return
        }

        console.warn('Failed to fetch payments, falling back to mock data', err)

        const message =
          err instanceof Error ? err.message : 'Unknown error fetching payments'
        setError(message)
        setRows(MOCK_PAYMENTS)
        setHasNextPage(false)
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [
    filters.status,
    filters.method,
    filters.blockchain,
    filters.since,
    filters.until,
    filters.search,
    filters.page,
  ])

  const payments = useMemo(
    () => applyClientFilters(rows, filters),
    [rows, filters],
  )

  return {
    payments,
    loading,
    error,
    pageSize: PAGE_SIZE,
    hasNextPage,
  }
}

