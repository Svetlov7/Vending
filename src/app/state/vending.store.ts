import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { COINS } from '@core/config/vending.config';
import { Product } from '@core/models/product.model';
import { formatMoney } from '@core/utils/money';
import { ProductsStore } from './products.store';

interface VendingState {
  // Amounts are stored in cents.
  balance: number;
  change: number;
  selectedProduct: Product | null;
  message: string;
}

const initialState: VendingState = {
  balance: 0,
  change: 0,
  selectedProduct: null,
  message: '',
};

export const VendingStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ balance, change, selectedProduct }) => {
    const priceCents = computed(() => selectedProduct()?.priceCents ?? 0);
    const isEnoughMoney = computed(() => !!selectedProduct() && balance() >= priceCents());

    return {
      priceCents,
      isEnoughMoney,
      remainingCents: computed(() => Math.max(0, priceCents() - balance())),
      calculatedChangeCents: computed(() => (isEnoughMoney() ? balance() - priceCents() : 0)),
      balanceLabel: computed(() => formatMoney(balance())),
      changeLabel: computed(() => formatMoney(change())),
    };
  }),
  withMethods((store, productsStore = inject(ProductsStore)) => ({
    insertCoin(coin: number): void {
      if (!(COINS as readonly number[]).includes(coin)) {
        patchState(store, { message: 'Coin not accepted' });
        return;
      }

      patchState(store, (state) => ({
        balance: state.balance + coin,
        change: 0,
        message: '',
      }));
    },

    selectProduct(product: Product): void {
      patchState(store, {
        selectedProduct: product,
        change: 0,
        message: `${product.title}: ${formatMoney(product.priceCents)}`,
      });
    },

    buy(): { product: Product; changeCents: number } | null {
      const product = store.selectedProduct();
      if (!product) {
        patchState(store, { message: 'Select a product first' });
        return null;
      }

      const price = store.priceCents();
      const balance = store.balance();
      if (balance < price) {
        patchState(store, { message: `Insert ${formatMoney(price - balance)} more` });
        return null;
      }

      const changeCents = balance - price;
      productsStore.decrementStock(product.id);
      patchState(store, {
        balance: 0,
        change: changeCents,
        selectedProduct: null,
        message: `Enjoy your ${product.title}`,
      });
      return { product, changeCents };
    },

    // Keeps selectedProduct so the payment modal stays usable.
    resetBalance(): void {
      patchState(store, (state) => ({
        balance: 0,
        change: state.balance,
        message: 'Coins returned',
      }));
    },

    cancelTransaction(): void {
      patchState(store, (state) => ({
        balance: 0,
        change: state.balance,
        selectedProduct: null,
        message: 'Transaction cancelled',
      }));
    },
  })),
);
