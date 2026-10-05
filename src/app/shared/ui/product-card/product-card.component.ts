import { Component, input, linkedSignal } from '@angular/core';
import type { Product } from '@core/models/product.model';
import { MoneyPipe } from '@shared/pipes/money.pipe';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [MoneyPipe],
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
  readonly product = input.required<Product>();

  // Reset the error flag when the image source changes.
  protected readonly imageFailed = linkedSignal<string | null, boolean>({
    source: () => this.product().image,
    computation: () => false,
  });

  protected onImageError(): void {
    this.imageFailed.set(true);
  }
}
