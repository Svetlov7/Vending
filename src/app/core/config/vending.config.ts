export const CURRENCY = 'EUR';
export const LOCALE = 'en-IE';

// Accepted denominations in cents.
export const COINS = [10, 20, 50, 100, 200] as const;

// Max units of a single product the machine can hold.
export const MAX_STOCK = 15;

// Max product price in cents.
export const MAX_PRICE_CENTS = 3000;

// Prices must be a multiple of the smallest coin so change can always be given.
export const PRICE_STEP_CENTS = 10;

export const TITLE_MIN_LENGTH = 2;
export const TITLE_MAX_LENGTH = 30;
