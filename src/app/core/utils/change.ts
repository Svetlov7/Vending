import { COINS } from '@core/config/vending.config';
import type { Coin } from '@core/models/coin.model';

export interface ChangeCoin {
  coin: Coin;
  count: number;
}

// Greedy gives the fewest coins for this euro denomination set.
export const breakdownChange = (changeCents: number): ChangeCoin[] => {
  let rest = changeCents;
  const result: ChangeCoin[] = [];

  for (const coin of [...COINS].sort((a, b) => b - a)) {
    const count = Math.floor(rest / coin);
    if (count > 0) {
      result.push({ coin, count });
      rest -= count * coin;
    }
  }

  return result;
};
