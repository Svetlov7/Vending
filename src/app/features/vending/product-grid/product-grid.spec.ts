import { Dialog } from '@angular/cdk/dialog';
import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import type { Product } from '@core/models/product.model';
import { PaymentModal, PaymentResult } from '@features/vending/payment-modal/payment-modal';
import { PurchaseSuccessModal } from '@features/vending/purchase-success-modal/purchase-success-modal';
import { ProductsStore } from '@state/products.store';
import { ProductGrid } from './product-grid';

const product: Product = { id: '1', title: 'Cola', priceCents: 150, stock: 3, image: null };

describe('ProductGrid', () => {
  const setup = () => {
    const closed = new Subject<PaymentResult | undefined>();
    const dialog = { open: vi.fn().mockReturnValue({ closed }) };
    TestBed.configureTestingModule({
      providers: [
        { provide: Dialog, useValue: dialog },
        { provide: ProductsStore, useValue: { products: () => [] } },
      ],
    });
    const grid = TestBed.runInInjectionContext(() => new ProductGrid());
    grid.selectProduct(product);
    return { dialog, closed };
  };

  it('opens the payment modal on selection', () => {
    const { dialog } = setup();

    expect(dialog.open).toHaveBeenCalledTimes(1);
    expect(dialog.open.mock.calls[0][0]).toBe(PaymentModal);
  });

  it('opens the success modal after a confirmed purchase', () => {
    const { dialog, closed } = setup();

    closed.next({ confirmed: true, product, changeCents: 50 });

    expect(dialog.open).toHaveBeenCalledTimes(2);
    expect(dialog.open.mock.calls[1][0]).toBe(PurchaseSuccessModal);
    expect(dialog.open.mock.calls[1][1].data).toEqual({ product, changeCents: 50 });
  });

  it('does not open the success modal on cancel or backdrop close', () => {
    const first = setup();
    first.closed.next({ confirmed: false });
    expect(first.dialog.open).toHaveBeenCalledTimes(1);

    TestBed.resetTestingModule();
    const second = setup();
    second.closed.next(undefined);
    expect(second.dialog.open).toHaveBeenCalledTimes(1);
  });
});
