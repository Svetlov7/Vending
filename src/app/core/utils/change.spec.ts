import { breakdownChange } from './change';

describe('breakdownChange', () => {
  it('returns no coins for zero change', () => {
    expect(breakdownChange(0)).toEqual([]);
  });

  it('splits change from the largest denomination down', () => {
    expect(breakdownChange(380)).toEqual([
      { coin: 200, count: 1 },
      { coin: 100, count: 1 },
      { coin: 50, count: 1 },
      { coin: 20, count: 1 },
      { coin: 10, count: 1 },
    ]);
  });

  it('counts repeated coins and skips unused denominations', () => {
    expect(breakdownChange(600)).toEqual([{ coin: 200, count: 3 }]);
    expect(breakdownChange(40)).toEqual([{ coin: 20, count: 2 }]);
  });
});
