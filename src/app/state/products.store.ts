import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, catchError, pipe, switchMap, tap } from 'rxjs';
import { ProductsApi } from '@core/api/products.api';
import { MAX_STOCK } from '@core/config/vending.config';
import { Product } from '@core/models/product.model';

interface ProductsState {
  products: Product[];
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  error: null,
};

const clampStock = (stock: number) => Math.min(Math.max(stock, 0), MAX_STOCK);

export const ProductsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, api = inject(ProductsApi)) => ({
    load: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { error: null })),
        switchMap(() =>
          api.fetchProducts().pipe(
            tap((products) =>
              patchState(store, {
                products: products.map((p) => ({ ...p, stock: clampStock(p.stock) })),
              }),
            ),
            catchError(() => {
              patchState(store, { error: 'Failed to load products' });
              return EMPTY;
            }),
          ),
        ),
      ),
    ),

    addProduct(product: Omit<Product, 'id'>): string {
      const id = crypto.randomUUID();
      patchState(store, (state) => ({
        products: [...state.products, { ...product, id, stock: clampStock(product.stock) }],
      }));
      return id;
    },

    updateProduct(id: string, changes: Partial<Product>): void {
      // id is immutable: drop it from changes.
      const { id: _ignored, ...rest } = changes;
      patchState(store, (state) => ({
        products: state.products.map((p) =>
          p.id === id ? { ...p, ...rest, stock: clampStock(rest.stock ?? p.stock) } : p,
        ),
      }));
    },

    deleteProduct(id: string): void {
      patchState(store, (state) => ({
        products: state.products.filter((p) => p.id !== id),
      }));
    },

    decrementStock(id: string): void {
      patchState(store, (state) => ({
        products: state.products.map((p) =>
          p.id === id && p.stock > 0 ? { ...p, stock: p.stock - 1 } : p,
        ),
      }));
    },
  })),
);
