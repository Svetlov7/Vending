import { Component, computed, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl } from '@angular/forms';
import type { ErrorMessages } from '@core/constants/validation-messages';
import { merge, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-form-field-error',
  template: `
    @if (message(); as text) {
      <p class="mt-1 text-xs font-medium text-red-600" role="alert">{{ text }}</p>
    }
  `,
})
export class FormFieldErrorComponent {
  readonly control = input.required<AbstractControl>();
  readonly messages = input.required<ErrorMessages>();

  // Control state is not signal-based, so re-evaluate on every control event.
  private readonly controlEvents = toSignal(
    toObservable(this.control).pipe(switchMap((control) => merge(of(null), control.events))),
  );

  protected readonly message = computed(() => {
    this.controlEvents();
    const control = this.control();
    if (!control.errors || !(control.touched || control.dirty)) {
      return null;
    }
    const messages = this.messages();
    const key = Object.keys(control.errors).find((errorKey) => errorKey in messages);
    return key ? messages[key] : null;
  });
}
