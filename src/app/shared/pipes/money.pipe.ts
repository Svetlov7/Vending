import { Pipe, PipeTransform } from '@angular/core';
import { formatMoney } from '@core/utils/money';

@Pipe({ name: 'money' })
export class MoneyPipe implements PipeTransform {
  transform(cents: number): string {
    return formatMoney(cents);
  }
}
