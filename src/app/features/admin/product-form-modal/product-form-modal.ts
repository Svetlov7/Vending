import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MAX_PRICE_CENTS,
  MAX_STOCK,
  TITLE_MAX_LENGTH,
  TITLE_MIN_LENGTH,
} from '@core/config/vending.config';
import { PRODUCT_FORM_ERRORS } from '@core/constants/validation-messages';
import type { Product, ProductFormValue } from '@core/models/product.model';
import { integerValidator, priceStepValidator } from '@core/validators/number.validators';
import { centsToEuros, eurosToCents } from '@core/utils/money';
import { ButtonDirective } from '@shared/components/button/button.directive';
import { FormFieldErrorComponent } from '@shared/ui/form-field-error/form-field-error.component';
import { ModalShellComponent } from '@shared/ui/modal-shell/modal-shell.component';
import { MoneyInputDirective } from '@shared/ui/money-input/money-input.directive';
import { ProductsStore } from '@state/products.store';

export interface ProductFormModalData {
  product?: Product;
}

export interface ProductFormModalResult {
  action: 'created' | 'updated';
  productId: string;
  productTitle: string;
}

@Component({
  selector: 'app-product-form-modal',
  imports: [
    ReactiveFormsModule,
    ModalShellComponent,
    FormFieldErrorComponent,
    MoneyInputDirective,
    ButtonDirective,
  ],
  templateUrl: './product-form-modal.html',
})
export class ProductFormModal {
  private readonly productsStore = inject(ProductsStore);
  private readonly dialogRef = inject<DialogRef<ProductFormModalResult>>(DialogRef);
  private readonly data = inject<ProductFormModalData | null>(DIALOG_DATA, { optional: true });

  protected readonly editedProduct = this.data?.product;
  protected readonly modalTitle = this.editedProduct ? 'Edit Product' : 'Add Product';
  protected readonly titleMaxLength = TITLE_MAX_LENGTH;
  protected readonly errors = PRODUCT_FORM_ERRORS;

  protected readonly form = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(TITLE_MIN_LENGTH),
        Validators.maxLength(TITLE_MAX_LENGTH),
      ],
    }),
    stock: new FormControl<number | null>(null, {
      validators: [
        Validators.required,
        integerValidator,
        Validators.min(0),
        Validators.max(MAX_STOCK),
      ],
    }),
    // Price control holds euros; the model holds cents.
    price: new FormControl<number | null>(null, {
      validators: [
        Validators.required,
        Validators.min(0.01),
        Validators.max(centsToEuros(MAX_PRICE_CENTS)),
        priceStepValidator,
      ],
    }),
  });

  constructor() {
    if (this.editedProduct) {
      const { title, stock, priceCents } = this.editedProduct;
      this.form.setValue({ title, stock, price: centsToEuros(priceCents) });
    }
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { title, stock, price } = this.form.getRawValue();
    if (stock === null || price === null) {
      return;
    }
    const formValue: ProductFormValue = {
      title: title.trim(),
      stock,
      priceCents: eurosToCents(price),
    };

    let result: ProductFormModalResult;
    if (this.editedProduct) {
      this.productsStore.updateProduct(this.editedProduct.id, formValue);
      result = {
        action: 'updated',
        productId: this.editedProduct.id,
        productTitle: formValue.title,
      };
    } else {
      const productId = this.productsStore.addProduct({ ...formValue, image: null });
      result = { action: 'created', productId, productTitle: formValue.title };
    }

    this.form.reset();
    this.dialogRef.close(result);
  }

  protected close(): void {
    this.dialogRef.close();
  }
}
