import { useEffect, useState } from 'react'
import { fetchEnhancedPayment } from '../api/payments'
import type { EnhancedPaymentInfo } from '../types/payments'
import { COINFLOW_MERCHANT_ID } from '../config'

interface UsePaymentDetailsResult {
  details: EnhancedPaymentInfo | null
  loading: boolean
  error: string | null
}

export function usePaymentDetails(
  paymentId: string | null,
): UsePaymentDetailsResult {
  const [details, setDetails] = useState<EnhancedPaymentInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!paymentId) {
      setDetails(null)
      setLoading(false)
      setError(null)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    fetchEnhancedPayment(paymentId, { merchantId: COINFLOW_MERCHANT_ID })
      .then((data) => {
        if (cancelled) return
        setDetails(data)
      })
      .catch((err) => {
        if (cancelled) return
        console.error('Failed to fetch enhanced payment info', err)
        setError(err instanceof Error ? err.message : 'Failed to load details')
        setDetails(null)
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [paymentId])

  return { details, loading, error }
}

