import type {
  RawPayment,
  UiPaymentRow,
  PaymentMethod,
  NormalizedStatus,
  BlockchainNetwork,
} from '../types/payments'
import { formatAmountMoney, formatDateTime } from './formatting'

export function derivePaymentMethod(raw: RawPayment): PaymentMethod {
  if (raw.cardInfo) return 'card'
  if (raw.bankTransferInfo) return 'bank_transfer'
  if (raw.pixInfo) return 'pix'
  if (raw.ibanInfo) return 'iban'
  if (raw.wireInfo) return 'wire'
  if (raw.cryptoInfo) return 'crypto'
  if (raw.instantInfo) return 'instant'
  return 'unknown'
}

export function getRawStatus(raw: RawPayment): string {
  const method = derivePaymentMethod(raw)

  if (method === 'card') return raw.cardInfo?.status ?? 'UNKNOWN'
  if (method === 'bank_transfer') return raw.bankTransferInfo?.status ?? 'UNKNOWN'
  if (method === 'pix') return raw.pixInfo?.status ?? 'UNKNOWN'
  if (method === 'iban') return raw.ibanInfo?.status ?? 'UNKNOWN'
  if (method === 'wire') return raw.wireInfo?.status ?? 'UNKNOWN'
  if (method === 'crypto') return raw.cryptoInfo?.status ?? 'UNKNOWN'
  if (method === 'instant') return raw.instantInfo?.status ?? 'UNKNOWN'

  return 'UNKNOWN'
}

export function normalizeStatus(rawStatus: string): NormalizedStatus {
  const normalized = rawStatus.toUpperCase()

  if (
    ['AUTHORIZED', 'CAPTURED', 'SUCCEEDED', 'COMPLETED', 'SETTLED'].some((status) =>
      normalized.includes(status),
    )
  ) {
    return 'COMPLETED'
  }

  if (
    ['FAILED', 'DECLINED', 'CANCELED', 'CHARGEBACK'].some((status) =>
      normalized.includes(status),
    )
  ) {
    return 'FAILED'
  }

  if (
    ['PENDING', 'INITIATED', 'REGISTERED'].some((status) =>
      normalized.includes(status),
    )
  ) {
    return 'PENDING'
  }

  return 'OTHER'
}

export function getCustomerLabel(raw: RawPayment): string {
  const enhanced = raw.cardInfo?.enhancedTxInfo
  const name = `${enhanced?.firstName ?? ''} ${enhanced?.lastName ?? ''}`.trim()
  const email = enhanced?.email ?? ''

  const customerId =
    typeof raw.customer === 'string'
      ? raw.customer
      : raw.customer?.email ??
        raw.customer?.name ??
        raw.customer?.id ??
        ''

  if (name) return name
  if (email) return email
  if (customerId) return customerId

  return 'Unknown customer'
}

export function getErrorMessage(raw: RawPayment): string {
  if (raw.error) return raw.error

  const method = derivePaymentMethod(raw)

  const reason =
    (method === 'bank_transfer' && raw.bankTransferInfo?.reason) ||
    (method === 'pix' && raw.pixInfo?.reason) ||
    (method === 'iban' && raw.ibanInfo?.reason) ||
    (method === 'wire' && raw.wireInfo?.reason) ||
    (method === 'crypto' && raw.cryptoInfo?.reason) ||
    (method === 'instant' && raw.instantInfo?.reason) ||
    null

  return reason ?? 'Unknown error'
}

export function toUiRow(raw: RawPayment): UiPaymentRow {
  const method = derivePaymentMethod(raw)
  const rawStatus = getRawStatus(raw)
  const normalizedStatus = normalizeStatus(rawStatus)
  const blockchain = normalizeBlockchain(raw)

  return {
    id: raw.paymentId,
    createdAt: raw.createdAt,
    customerLabel: getCustomerLabel(raw),
    customerEmail: getCustomerEmail(raw),
    method,
    amountLabel: formatAmountMoney(raw.totals.total),
    normalizedStatus,
    rawStatus,
    errorMessage: getErrorMessage(raw),
    blockchain,
  }
}

function normalizeBlockchain(raw: RawPayment): BlockchainNetwork {
  const chainCandidate =
    raw.blockchain ??
    raw.network ??
    (raw.cryptoInfo as Record<string, unknown> | undefined)?.['blockchain'] ??
    (raw.cryptoInfo as Record<string, unknown> | undefined)?.['network']

  if (typeof chainCandidate === 'string') {
    const lower = chainCandidate.toLowerCase()
    const allowed: BlockchainNetwork[] = [
      'solana',
      'eth',
      'polygon',
      'base',
      'user',
      'xion',
      'arbitrum',
    ]
    if (allowed.includes(lower as BlockchainNetwork)) {
      return lower as BlockchainNetwork
    }
  }

  return 'unknown'
}

function getCustomerEmail(raw: RawPayment): string | undefined {
  const enhancedEmail = raw.cardInfo?.enhancedTxInfo?.email

  if (enhancedEmail) {
    return enhancedEmail
  }

  if (typeof raw.customer === 'string') {
    return raw.customer.includes('@') ? raw.customer : undefined
  }

  return raw.customer?.email
}

export function formatMethodLabel(method: PaymentMethod): string {
  switch (method) {
    case 'card':
      return 'Card'
    case 'bank_transfer':
      return 'Bank transfer'
    case 'pix':
      return 'Pix'
    case 'iban':
      return 'IBAN'
    case 'wire':
      return 'Wire'
    case 'crypto':
      return 'Crypto'
    case 'instant':
      return 'Instant'
    default:
      return 'Unknown'
  }
}

export function formatDateTimeForUi(iso: string): string {
  return formatDateTime(iso)
}

