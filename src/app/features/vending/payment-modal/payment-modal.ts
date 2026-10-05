import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { COINS } from '@core/config/vending.config';
import type { Coin } from '@core/models/coin.model';
import type { Product } from '@core/models/product.model';
import { formatMoney } from '@core/utils/money';
import { MoneyPipe } from '@shared/pipes/money.pipe';
import { ButtonDirective } from '@shared/components/button/button.directive';
import { CoinComponent } from '@shared/ui/coin/coin.component';
import { ModalShellComponent } from '@shared/ui/modal-shell/modal-shell.component';
import { VendingStore } from '@state/vending.store';

export type PaymentResult =
  { confirmed: true; product: Product; changeCents: number } | { confirmed: false };

@Component({
  selector: 'app-payment-modal',
  imports: [ModalShellComponent, CoinComponent, MoneyPipe, ButtonDirective],
  templateUrl: './payment-modal.html',
})
export class PaymentModal {
  private readonly vendingStore = inject(VendingStore);
  private readonly dialogRef = inject<DialogRef<PaymentResult>>(DialogRef);

  protected readonly data = inject<{ product: Product }>(DIALOG_DATA);
  protected readonly coins = COINS;
  protected readonly imageFailed = signal(false);

  protected readonly insertedCents = this.vendingStore.balance;
  protected readonly priceCents = this.vendingStore.priceCents;
  protected readonly remainingCents = this.vendingStore.remainingCents;
  protected readonly changeCents = this.vendingStore.calculatedChangeCents;
  protected readonly isEnoughMoney = this.vendingStore.isEnoughMoney;

  protected readonly isCoinDisabled = computed(() => this.vendingStore.isEnoughMoney());

  constructor() {
    // Backdrop and Escape close the dialog with no result.
    this.dialogRef.closed.pipe(takeUntilDestroyed()).subscribe((result) => {
      if (result === undefined) {
        this.vendingStore.cancelTransaction();
      }
    });
  }

  protected formatCoinLabel(coin: number): string {
    return `+${formatMoney(coin)}`;
  }

  protected onImageError(): void {
    this.imageFailed.set(true);
  }

  protected onInsertCoin(coin: Coin): void {
    this.vendingStore.insertCoin(coin);
  }

  protected onReset(): void {
    this.vendingStore.resetBalance();
  }

  protected onConfirm(): void {
    const result = this.vendingStore.buy();
    if (result !== null) {
      this.dialogRef.close({
        confirmed: true,
        product: result.product,
        changeCents: result.changeCents,
      });
    }
  }

  protected onClose(): void {
    this.vendingStore.cancelTransaction();
    this.dialogRef.close({ confirmed: false });
  }
}
