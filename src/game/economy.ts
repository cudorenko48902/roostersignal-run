/**
 * Feathers are the only currency in this app. They are fictional and cosmetic:
 * nothing is gated behind them, they cannot be bought, sold, cashed out or
 * topped up, and this module deliberately exposes no price, purchase, ad or
 * balance-transfer API. The app is fully offline.
 */
import {formatNumber} from './scoring';

export const CURRENCY_NAME = 'FEATHERS';

export function addFeathers(balance: number, gained: number): number {
  return Math.max(0, Math.floor(balance) + Math.max(0, Math.floor(gained)));
}

export function formatFeathers(n: number): string {
  return formatNumber(n);
}

/** Used by the Settings footer line. */
export const OFFLINE_NOTICE = 'OFFLINE · NO ADS · NO PURCHASES · v1.0';
