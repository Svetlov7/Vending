import { centsToEuros, eurosToCents, formatMoney, isWholeCents } from './money';

// Euro amounts are strings so Prettier keeps two decimals (it strips trailing zeros from number literals).
const euros = (value: string): number => Number(value);

describe('money', () => {
  it('converts euros to cents without float drift', () => {
    expect(eurosToCents(euros('1.80'))).toBe(180);
    expect(eurosToCents(euros('0.10'))).toBe(10);
    expect(eurosToCents(euros('2.20'))).toBe(220);
    expect(eurosToCents(euros('30.00'))).toBe(3000);
  });

  it('converts cents to euros', () => {
    expect(centsToEuros(180)).toBe(euros('1.80'));
    expect(centsToEuros(10)).toBe(euros('0.10'));
  });

  it('detects sub-cent precision', () => {
    expect(isWholeCents(euros('1.80'))).toBe(true);
    expect(isWholeCents(euros('0.10'))).toBe(true);
    expect(isWholeCents(euros('1.005'))).toBe(false);
    expect(isWholeCents(Number.NaN)).toBe(false);
  });

  it('formats cents as EUR with two decimals', () => {
    expect(formatMoney(100)).toBe('€1.00');
    expect(formatMoney(180)).toBe('€1.80');
    expect(formatMoney(10)).toBe('€0.10');
    expect(formatMoney(3000)).toBe('€30.00');
  });
});
