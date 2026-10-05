import { FormControl } from '@angular/forms';
import { priceStepValidator } from './number.validators';

// Euro amounts are strings so Prettier keeps two decimals (it strips trailing zeros from number literals).
const validate = (value: string | null) =>
  priceStepValidator(new FormControl(value === null ? null : Number(value)));

describe('priceStepValidator', () => {
  it('accepts prices that are multiples of 0.10', () => {
    expect(validate('1.80')).toBeNull();
    expect(validate('0.10')).toBeNull();
    expect(validate('30.00')).toBeNull();
  });

  it('rejects off-step prices', () => {
    expect(validate('1.85')).toEqual({ priceStep: true });
    expect(validate('0.05')).toEqual({ priceStep: true });
  });

  it('rejects sub-cent precision instead of rounding', () => {
    expect(validate('1.801')).toEqual({ priceStep: true });
  });

  it('ignores empty values', () => {
    expect(validate(null)).toBeNull();
  });
});
