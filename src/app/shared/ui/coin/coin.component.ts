import { Component, computed, input, output } from '@angular/core';
import { coinVariants } from './coin.variants';

@Component({
  selector: 'app-coin',
  standalone: true,
  templateUrl: './coin.component.html',
})
export class CoinComponent {
  readonly label = input.required<string>();
  readonly valueCents = input<number>();
  readonly count = input<number>();
  readonly isInteractive = input<boolean>(true);
  readonly size = input<'sm' | 'md'>('md');
  readonly disabled = input<boolean>(false);

  readonly clicked = output<void>();

  protected readonly showBadge = computed(() => (this.count() ?? 0) > 1);

  protected readonly classes = computed(() =>
    coinVariants({
      size: this.size(),
      tier: (this.valueCents() ?? 0) >= 100 ? 'high' : 'low',
      state: this.disabled() ? 'disabled' : this.isInteractive() ? 'interactive' : 'static',
    }),
  );

  handleClick(): void {
    if (this.isInteractive() && !this.disabled()) {
      this.clicked.emit();
    }
  }
}
