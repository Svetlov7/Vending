import { computed, Directive, input } from '@angular/core';
import { buttonVariants, type ButtonSize, type ButtonVariant } from './button.variants';

@Directive({
  selector: 'button[appButton]',
  standalone: true,
  host: { '[class]': 'classes()' },
})
export class ButtonDirective {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
  readonly customClass = input<string>('');

  protected readonly classes = computed(() =>
    buttonVariants({
      variant: this.variant(),
      size: this.size(),
      className: this.customClass(),
    }),
  );
}
