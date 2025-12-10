import type { Money } from '../types/payments'

export function formatAmountMoney(money: Money): string {
  const amount = money.cents / 100
  return `${amount.toFixed(2)} ${money.currency.toUpperCase()}`
}

export function formatDateTime(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) {
    return iso
  }
  return date.toLocaleString()
}

