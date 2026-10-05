import {
  MAX_PRICE_CENTS,
  MAX_STOCK,
  PRICE_STEP_CENTS,
  TITLE_MAX_LENGTH,
  TITLE_MIN_LENGTH,
} from '@core/config/vending.config';
import { formatMoney } from '@core/utils/money';

export type ErrorMessages = Readonly<Record<string, string>>;

export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required.',
  MIN_LENGTH: `Minimum ${TITLE_MIN_LENGTH} characters.`,
  MAX_LENGTH: `Maximum ${TITLE_MAX_LENGTH} characters.`,
  INTEGER: 'Must be a whole number.',
  MIN_STOCK: 'Stock cannot be negative.',
  MAX_STOCK: `Maximum ${MAX_STOCK} units per slot.`,
  MIN_PRICE: 'Price must be greater than 0.',
  MAX_PRICE: `Maximum price is ${formatMoney(MAX_PRICE_CENTS)}.`,
  PRICE_STEP: `Price must be a multiple of ${formatMoney(PRICE_STEP_CENTS)}.`,
} as const;

// Maps Angular validation error keys to messages, per form field.
export const PRODUCT_FORM_ERRORS = {
  title: {
    required: VALIDATION_MESSAGES.REQUIRED,
    minlength: VALIDATION_MESSAGES.MIN_LENGTH,
    maxlength: VALIDATION_MESSAGES.MAX_LENGTH,
  },
  stock: {
    required: VALIDATION_MESSAGES.REQUIRED,
    integer: VALIDATION_MESSAGES.INTEGER,
    min: VALIDATION_MESSAGES.MIN_STOCK,
    max: VALIDATION_MESSAGES.MAX_STOCK,
  },
  price: {
    required: VALIDATION_MESSAGES.REQUIRED,
    min: VALIDATION_MESSAGES.MIN_PRICE,
    max: VALIDATION_MESSAGES.MAX_PRICE,
    priceStep: VALIDATION_MESSAGES.PRICE_STEP,
  },
} as const satisfies Record<string, ErrorMessages>;
