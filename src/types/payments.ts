export type NormalizedStatus = 'COMPLETED' | 'FAILED' | 'PENDING' | 'OTHER'

export type PaymentMethod =
  | 'card'
  | 'bank_transfer'
  | 'pix'
  | 'iban'
  | 'wire'
  | 'crypto'
  | 'instant'
  | 'unknown'

export type BlockchainNetwork =
  | 'solana'
  | 'eth'
  | 'polygon'
  | 'base'
  | 'user'
  | 'xion'
  | 'arbitrum'
  | 'unknown'

export interface UiPaymentRow {
  id: string
  createdAt: string
  customerLabel: string
  customerEmail?: string
  method: PaymentMethod
  amountLabel: string
  normalizedStatus: NormalizedStatus
  rawStatus: string
  errorMessage: string
  blockchain?: BlockchainNetwork
}

export interface Money {
  cents: number
  currency: string
}

export interface Totals {
  subtotal: Money
  creditCardFees: Money
  chargebackProtectionFees: Money
  gasFees: Money
  fxFees: Money
  total: Money
  networkFees: Money
  merchantPaidCreditCardFees: Money
  merchantPaidChargebackProtectionFees: Money
  merchantPaidGasFees: Money
  merchantPaidFxFees: Money
  merchantPaidNetworkFees: Money
}

export interface CardEnhancedTxInfo {
  firstName?: string
  lastName?: string
  email?: string
}

export interface CardInfo {
  processor?: string
  authCode?: string
  status?: string
  enhancedTxInfo?: CardEnhancedTxInfo
}

export interface BankTransferInfo {
  processor?: string
  status?: string
  reason?: string
}

export interface PixInfo {
  processor?: string
  status?: string
  reason?: string
}

export interface IbanInfo {
  processor?: string
  status?: string
  reason?: string
}

export interface WireInfo {
  processor?: string
  status?: string
  reason?: string
}

export interface CryptoInfo {
  status?: string
  reason?: string
}

export interface InstantInfo {
  status?: string
  reason?: string
}

export interface RawPayment {
  _id: string
  paymentId: string
  totals: Totals
  customer?:
    | string
    | {
        id?: string
        name?: string
        email?: string
      }
  merchant?: string
  createdAt: string
  error?: string | null
  cardInfo?: CardInfo
  bankTransferInfo?: BankTransferInfo
  pixInfo?: PixInfo
  ibanInfo?: IbanInfo
  wireInfo?: WireInfo
  cryptoInfo?: CryptoInfo
  instantInfo?: InstantInfo
  blockchain?: string
  network?: string
}

export interface EnhancedBrowserInfo {
  name?: string
  version?: string
  major?: string
}

export interface EnhancedDeviceMeta {
  model?: string
  type?: string
  vendor?: string
}

export interface EnhancedOsInfo {
  name?: string
  version?: string
}

export interface EnhancedDeviceInfo {
  ua?: string
  browser?: EnhancedBrowserInfo
  device?: EnhancedDeviceMeta
  engine?: EnhancedBrowserInfo
  os?: EnhancedOsInfo
  cpu?: {
    architecture?: string
  }
}

export interface EnhancedBinLocation {
  cardType?: string
  cardName?: string
  cardSegment?: string
  country?: string
  bankName?: string
}

export interface EnhancedNsurePredictionInsight {
  value?: number
  description?: string
  id?: string
}

export interface EnhancedNsureDecisionComponent {
  description?: string
  type?: string
}

export interface EnhancedNsureDecisionInsights {
  predictionInsights?: EnhancedNsurePredictionInsight[]
  decisionComponents?: EnhancedNsureDecisionComponent[]
  decision?: string
}

export interface EnhancedPaymentInfo {
  info?: {
    customer?: string
    firstName?: string
    lastName?: string
    email?: string
    blockchain?: string
    state?: string
    country?: string
    city?: string
    streetAddress?: string
    zip?: string
    deviceInfo?: EnhancedDeviceInfo
    ip?: string
    userAgent?: string
    bin?: string
    binLocation?: EnhancedBinLocation
    nsureDecisionInsights?: EnhancedNsureDecisionInsights
    secureDS?: unknown
    avsResponseCode?: string
    cvvResponseCode?: string
    eci?: string
    ipLocation?: {
      zip?: string
      city?: string
      isp?: string
      region?: string
      country?: string
      lon?: string
      lat?: string
      hosting?: boolean
      mobile?: boolean
      proxy?: boolean
    }
  }
}

