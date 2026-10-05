import { CURRENCY, LOCALE } from '@core/config/vending.config';

const CENTS_IN_UNIT = 100;

const formatter = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: CURRENCY,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// Callers must validate with isWholeCents first; this rounds only float noise.
export const eurosToCents = (euros: number): number => Math.round(euros * CENTS_IN_UNIT);

export const centsToEuros = (cents: number): number => cents / CENTS_IN_UNIT;

export const isWholeCents = (euros: number): boolean =>
  Number.isFinite(euros) &&
  Math.abs(euros * CENTS_IN_UNIT - Math.round(euros * CENTS_IN_UNIT)) < 1e-6;

export const formatMoney = (cents: number): string => formatter.format(centsToEuros(cents));
