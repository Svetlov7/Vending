import { AfterViewInit, Directive, ElementRef, inject } from '@angular/core';
import { isWholeCents } from '@core/utils/money';

@Directive({
  selector: 'input[appMoneyInput]',
  host: { '(blur)': 'format()' },
})
export class MoneyInputDirective implements AfterViewInit {
  private readonly input = inject<ElementRef<HTMLInputElement>>(ElementRef).nativeElement;

  ngAfterViewInit(): void {
    this.format();
  }

  // Display only: the control value is unchanged, and sub-cent input is left visible for validation.
  protected format(): void {
    if (this.input.value === '') {
      return;
    }
    const euros = Number(this.input.value);
    if (isWholeCents(euros)) {
      this.input.value = euros.toFixed(2);
    }
  }
}
