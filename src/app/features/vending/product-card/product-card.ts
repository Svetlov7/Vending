import { Component, computed, input, output } from '@angular/core';
import type { Product } from '@core/models/product.model';
import { ProductCardComponent } from '@shared/ui/product-card/product-card.component';

@Component({
  selector: 'app-vending-product-card',
  imports: [ProductCardComponent],
  templateUrl: './product-card.html',
  host: {
    class:
      'block rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-600',
    role: 'button',
    '[attr.tabindex]': 'isDisabled() ? -1 : 0',
    '[attr.aria-disabled]': 'isDisabled()',
    '[attr.aria-label]': 'ariaLabel()',
    '[class.cursor-pointer]': '!isDisabled()',
    '[class.cursor-not-allowed]': 'isDisabled()',
    '[class.opacity-75]': 'isDisabled()',
    '(click)': 'select()',
    '(keydown.enter)': 'onKey($event)',
    '(keydown.space)': 'onKey($event)',
  },
})
export class VendingProductCard {
  readonly product = input.required<Product>();
  readonly selected = output<void>();

  protected readonly isDisabled = computed(() => this.product().stock === 0);
  protected readonly ariaLabel = computed(() =>
    this.isDisabled() ? `${this.product().title}, sold out` : `Select ${this.product().title}`,
  );

  protected select(): void {
    if (!this.isDisabled()) {
      this.selected.emit();
    }
  }

  protected onKey(event: Event): void {
    // Prevent page scroll on Space.
    event.preventDefault();
    this.select();
  }
}
