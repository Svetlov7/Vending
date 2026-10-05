import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import type { Product } from '@core/models/product.model';
import { breakdownChange } from '@core/utils/change';
import { formatMoney } from '@core/utils/money';
import { ButtonDirective } from '@shared/components/button/button.directive';
import { MoneyPipe } from '@shared/pipes/money.pipe';
import { CoinComponent } from '@shared/ui/coin/coin.component';
import { ModalShellComponent } from '@shared/ui/modal-shell/modal-shell.component';

export interface PurchaseSuccessData {
  product: Product;
  changeCents: number;
}

export const PURCHASE_SUCCESS_TIMEOUT_MS = 15_000;

@Component({
  selector: 'app-purchase-success-modal',
  imports: [ModalShellComponent, CoinComponent, MoneyPipe, ButtonDirective],
  templateUrl: './purchase-success-modal.html',
})
export class PurchaseSuccessModal {
  private readonly dialogRef = inject<DialogRef<void>>(DialogRef);

  protected readonly data = inject<PurchaseSuccessData>(DIALOG_DATA);
  protected readonly changeCoins = breakdownChange(this.data.changeCents);
  protected readonly imageFailed = signal(false);

  constructor() {
    const timer = setTimeout(() => this.onClose(), PURCHASE_SUCCESS_TIMEOUT_MS);
    inject(DestroyRef).onDestroy(() => clearTimeout(timer));
  }

  protected formatCoinLabel(coin: number): string {
    return formatMoney(coin);
  }

  protected onImageError(): void {
    this.imageFailed.set(true);
  }

  protected onClose(): void {
    this.dialogRef.close();
  }
}
