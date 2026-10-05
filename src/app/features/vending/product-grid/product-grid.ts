import { Dialog } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { take } from 'rxjs';
import { Product } from '@core/models/product.model';
import { ProductsStore } from '@state/products.store';
import { VendingStore } from '@state/vending.store';
import { PaymentModal, PaymentResult } from '@features/vending/payment-modal/payment-modal';
import { VendingProductCard } from '@features/vending/product-card/product-card';
import {
  PurchaseSuccessData,
  PurchaseSuccessModal,
} from '@features/vending/purchase-success-modal/purchase-success-modal';

@Component({
  selector: 'app-product-grid',
  imports: [VendingProductCard],
  templateUrl: './product-grid.html',
})
export class ProductGrid {
  readonly products = inject(ProductsStore).products;
  private readonly vendingStore = inject(VendingStore);
  private readonly dialog = inject(Dialog);

  selectProduct(product: Product): void {
    this.vendingStore.selectProduct(product);
    const paymentRef = this.dialog.open<PaymentResult>(PaymentModal, {
      data: { product },
      maxWidth: '500px',
      width: '95%',
    });

    // Backdrop/Escape close with undefined, so only a confirmed purchase opens the receipt.
    paymentRef.closed.pipe(take(1)).subscribe((result) => {
      if (result?.confirmed) {
        this.dialog.open<void, PurchaseSuccessData>(PurchaseSuccessModal, {
          data: { product: result.product, changeCents: result.changeCents },
          maxWidth: '500px',
          width: '95%',
        });
      }
    });
  }
}
