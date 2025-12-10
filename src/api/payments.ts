import { get } from './client'
import type { RawPayment, EnhancedPaymentInfo } from '../types/payments'

export interface GetPaymentsParams {
  since?: string
  until?: string
  page?: number
  limit?: number
  status?: string
  search?: string
  sortBy?: 'createdAt' | 'amount'
  sortDirection?: 1 | -1
  method?: string
  blockchain?: string
  protection?: string
  merchantId?: string
  amount?: string
  authCode?: string
}

export type GetPaymentsResponse = RawPayment[]

const PAYMENTS_ENDPOINT = '/api/merchant/payments'

export async function fetchPayments(
  params: GetPaymentsParams,
): Promise<GetPaymentsResponse> {
  const queryParams: Record<string, string | number | undefined> = {}

  for (const [key, value] of Object.entries(params)) {
    queryParams[key] = value
  }

  return get<GetPaymentsResponse>(PAYMENTS_ENDPOINT, queryParams)
}

export async function fetchEnhancedPayment(
  paymentId: string,
  params?: { merchantId?: string },
): Promise<EnhancedPaymentInfo> {
  return get<EnhancedPaymentInfo>(
    `${PAYMENTS_ENDPOINT}/enhanced/${paymentId}`,
    params,
  )
}

