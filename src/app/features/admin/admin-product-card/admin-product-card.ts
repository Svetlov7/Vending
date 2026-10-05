import { Component, input, output } from '@angular/core';
import type { Product } from '@core/models/product.model';
import { ProductCardComponent } from '@shared/ui/product-card/product-card.component';
import { ButtonDirective } from '@shared/components/button/button.directive';

@Component({
  selector: 'app-admin-product-card',
  imports: [ProductCardComponent, ButtonDirective],
  templateUrl: './admin-product-card.html',
  host: { class: 'block' },
})
export class AdminProductCard {
  readonly product = input.required<Product>();
  readonly edit = output<void>();
  readonly remove = output<void>();
}
