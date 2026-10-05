import { MoneyPipe } from './money.pipe';

describe('MoneyPipe', () => {
  const pipe = new MoneyPipe();

  it('formats cents as EUR with two decimals', () => {
    expect(pipe.transform(0)).toBe('€0.00');
    expect(pipe.transform(10)).toBe('€0.10');
    expect(pipe.transform(180)).toBe('€1.80');
    expect(pipe.transform(3000)).toBe('€30.00');
  });
});
