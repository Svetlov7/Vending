import { TestBed } from '@angular/core/testing';
import type { Product } from '@core/models/product.model';
import { VendingStore } from './vending.store';

const product: Product = { id: '1', title: 'Cola', priceCents: 180, stock: 3, image: null };

describe('VendingStore pricing', () => {
  const setup = () => {
    const store = TestBed.inject(VendingStore);
    store.selectProduct(product);
    return store;
  };

  it('uses priceCents directly and formats the selection message', () => {
    const store = setup();

    expect(store.priceCents()).toBe(180);
    expect(store.message()).toBe('Cola: €1.80');
  });

  it('computes remaining amount and change in cents', () => {
    const store = setup();

    store.insertCoin(100);
    expect(store.remainingCents()).toBe(80);
    expect(store.isEnoughMoney()).toBe(false);

    store.insertCoin(100);
    expect(store.isEnoughMoney()).toBe(true);
    expect(store.calculatedChangeCents()).toBe(20);
  });
});
