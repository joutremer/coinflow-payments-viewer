import type { EnhancedPaymentInfo } from '../types/payments'

interface PaymentDetailsPanelProps {
  paymentId: string | null
  details: EnhancedPaymentInfo | null
  loading: boolean
  error: string | null
}

function buildCustomerLabel(info: EnhancedPaymentInfo['info']) {
  if (!info) return 'Unknown customer'

  const name = `${info.firstName ?? ''} ${info.lastName ?? ''}`.trim()
  if (name) return name

  if (info.customer) return info.customer
  if (info.email) return info.email

  return 'Unknown customer'
}

function buildDeviceSummary(info: EnhancedPaymentInfo['info']) {
  if (!info?.deviceInfo) return 'No device info available'

  const parts: string[] = []

  const browser = info.deviceInfo.browser
  if (browser?.name) {
    const version = browser.version ? ` ${browser.version}` : ''
    parts.push(`${browser.name}${version}`.trim())
  }

  const os = info.deviceInfo.os
  if (os?.name) {
    const version = os.version ? ` ${os.version}` : ''
    parts.push(`${os.name}${version}`.trim())
  }

  const device = info.deviceInfo.device
  if (device?.vendor || device?.model) {
    parts.push([device.vendor, device.model].filter(Boolean).join(' '))
  }

  if (parts.length === 0 && info.deviceInfo.ua) {
    parts.push(info.deviceInfo.ua)
  }

  return parts.length > 0 ? parts.join(' • ') : 'No device info available'
}

function buildLocationSummary(info: EnhancedPaymentInfo['info']) {
  if (!info) return '—'

  const parts = [info.city, info.state, info.country].filter(Boolean)

  if (parts.length > 0) {
    return parts.join(', ')
  }

  const ipLocation = info.ipLocation
  if (ipLocation) {
    const ipParts = [ipLocation.city, ipLocation.region, ipLocation.country].filter(
      Boolean,
    )
    if (ipParts.length > 0) {
      return ipParts.join(', ')
    }
  }

  return '—'
}

function buildBinSummary(info: EnhancedPaymentInfo['info']) {
  if (!info?.binLocation) return '—'

  const { cardType, cardName, bankName, country } = info.binLocation
  const parts = [cardType, cardName, bankName, country].filter(Boolean)

  return parts.length > 0 ? parts.join(' • ') : '—'
}

function formatBlockchain(blockchain?: string | null) {
  if (!blockchain) return '—'
  return blockchain.charAt(0).toUpperCase() + blockchain.slice(1)
}

export function PaymentDetailsPanel({
  paymentId,
  details,
  loading,
  error,
}: PaymentDetailsPanelProps) {
  if (!paymentId) {
    return (
      <section className="details-panel">
        <h2>Payment Details</h2>
        <p className="details-placeholder">Select a payment to view details.</p>
      </section>
    )
  }

  if (loading) {
    return (
      <section className="details-panel">
        <h2>Payment Details</h2>
        <p className="details-placeholder">Loading enhanced data…</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="details-panel">
        <h2>Payment Details</h2>
        <p className="details-error">Error loading details: {error}</p>
      </section>
    )
  }

  const info = details?.info

  return (
    <section className="details-panel">
      <h2>Payment Details</h2>
      <div className="details-grid">
        <div className="details-item">
          <span className="details-label">Payment ID</span>
          <span className="mono">{paymentId}</span>
        </div>
        <div className="details-item">
          <span className="details-label">Customer</span>
          <span>{buildCustomerLabel(info)}</span>
        </div>
        <div className="details-item">
          <span className="details-label">Email</span>
          <span>{info?.email ?? '—'}</span>
        </div>
        <div className="details-item">
          <span className="details-label">Device</span>
          <span>{buildDeviceSummary(info)}</span>
        </div>
        <div className="details-item">
          <span className="details-label">Blockchain</span>
          <span>{formatBlockchain(info?.blockchain)}</span>
        </div>
        <div className="details-item">
          <span className="details-label">Location</span>
          <span>{buildLocationSummary(info)}</span>
        </div>
        <div className="details-item">
          <span className="details-label">BIN Details</span>
          <span>{buildBinSummary(info)}</span>
        </div>
        <div className="details-item">
          <span className="details-label">AVS / CVV</span>
          <span>
            {info?.avsResponseCode ?? '—'} / {info?.cvvResponseCode ?? '—'}
          </span>
        </div>
        <div className="details-item">
          <span className="details-label">IP Address</span>
          <span>{info?.ip ?? '—'}</span>
        </div>
      </div>
    </section>
  )
}

