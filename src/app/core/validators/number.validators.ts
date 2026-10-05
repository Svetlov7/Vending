import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { PRICE_STEP_CENTS } from '@core/config/vending.config';
import { eurosToCents, isWholeCents } from '@core/utils/money';

const isEmpty = (value: unknown): boolean => value === null || value === undefined || value === '';

export const integerValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null =>
  isEmpty(control.value) || Number.isInteger(control.value) ? null : { integer: true };

// Control value is in euros; rejects sub-cent precision and off-step prices instead of rounding.
export const priceStepValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  if (isEmpty(control.value)) {
    return null;
  }
  const euros = Number(control.value);
  return isWholeCents(euros) && eurosToCents(euros) % PRICE_STEP_CENTS === 0
    ? null
    : { priceStep: true };
};
