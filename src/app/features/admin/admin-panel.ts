import { Dialog } from '@angular/cdk/dialog';
import { afterNextRender, Component, DOCUMENT, inject, Injector, signal } from '@angular/core';
import type { Product } from '@core/models/product.model';
import { ButtonDirective } from '@shared/components/button/button.directive';
import { ProductsStore } from '@state/products.store';
import { AdminProductCard } from './admin-product-card/admin-product-card';
import {
  ProductFormModal,
  ProductFormModalData,
  ProductFormModalResult,
} from './product-form-modal/product-form-modal';
import {
  SuccessConfirmModal,
  SuccessConfirmModalData,
} from './success-confirm-modal/success-confirm-modal';

@Component({
  selector: 'app-admin-panel',
  imports: [AdminProductCard, ButtonDirective],
  templateUrl: './admin-panel.html',
})
export class AdminPanel {
  private readonly productsStore = inject(ProductsStore);
  private readonly dialog = inject(Dialog);
  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);

  protected readonly products = this.productsStore.products;
  protected readonly highlightedId = signal<string | null>(null);

  protected productDomId(productId: string): string {
    return `product-${productId}`;
  }

  protected deleteProduct(product: Product): void {
    this.productsStore.deleteProduct(product.id);
    this.openSuccessModal({ action: 'deleted', productTitle: product.title });
  }

  protected openProductForm(product?: Product): void {
    const dialogRef = this.dialog.open<ProductFormModalResult, ProductFormModalData>(
      ProductFormModal,
      {
        data: { product },
        maxWidth: '500px',
        width: '95%',
      },
    );

    // The form dialog is already closed here, so the success modal never stacks on top of it.
    dialogRef.closed.subscribe((result) => {
      if (!result) {
        return;
      }
      const successRef = this.openSuccessModal({
        action: result.action,
        productTitle: result.productTitle,
      });
      if (result.action === 'created') {
        // Reveal after the success modal closes so the highlight isn't hidden behind its backdrop.
        successRef.closed.subscribe(() => this.revealProduct(result.productId));
      }
    });
  }

  private openSuccessModal(data: SuccessConfirmModalData) {
    return this.dialog.open<void, SuccessConfirmModalData>(SuccessConfirmModal, {
      data,
      maxWidth: '400px',
      width: '95%',
    });
  }

  protected onHighlightEnd(event: AnimationEvent, productId: string): void {
    if (event.target === event.currentTarget && this.highlightedId() === productId) {
      this.highlightedId.set(null);
    }
  }

  // Wait for Angular to render the new card before looking it up in the DOM.
  private revealProduct(productId: string): void {
    afterNextRender(
      () => {
        const card = this.document.getElementById(this.productDomId(productId));
        if (!card) {
          return;
        }
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        card.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
        this.highlightedId.set(productId);
      },
      { injector: this.injector },
    );
  }
}
