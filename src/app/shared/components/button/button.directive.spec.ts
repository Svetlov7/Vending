import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ButtonDirective } from './button.directive';
import { ButtonSize, ButtonVariant, buttonVariants } from './button.variants';

@Component({
  imports: [ButtonDirective],
  template: `
    <button
      appButton
      class="flex-1"
      [variant]="variant()"
      [size]="size()"
      [customClass]="customClass()"
      [disabled]="disabled()"
      type="button"
      (click)="clicks = clicks + 1"
    >
      Go
    </button>
  `,
})
class HostComponent {
  readonly variant = signal<ButtonVariant>('danger');
  readonly size = signal<ButtonSize>('sm');
  readonly customClass = signal('');
  readonly disabled = signal(false);
  clicks = 0;
}

describe('buttonVariants', () => {
  it('applies default variant and size', () => {
    const classes = buttonVariants();

    expect(classes).toContain('bg-lime-500');
    expect(classes).toContain('rounded-xl');
  });

  it('appends a custom class', () => {
    expect(buttonVariants({ className: 'w-full' })).toContain('w-full');
  });
});

describe('ButtonDirective', () => {
  const setup = () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const button = (fixture.nativeElement as HTMLElement).querySelector('button')!;
    return { fixture, host: fixture.componentInstance, button };
  };

  it('applies variant and size classes and keeps static classes', () => {
    const { button } = setup();

    expect(button.classList.contains('bg-rose-500')).toBe(true);
    expect(button.classList.contains('rounded-lg')).toBe(true);
    expect(button.classList.contains('flex-1')).toBe(true);
  });

  it('updates classes when inputs change', () => {
    const { fixture, host, button } = setup();

    host.variant.set('ghost');
    host.size.set('icon');
    host.customClass.set('w-full');
    fixture.detectChanges();

    expect(button.classList.contains('bg-rose-500')).toBe(false);
    expect(button.classList.contains('bg-transparent')).toBe(true);
    expect(button.classList.contains('rounded-full')).toBe(true);
    expect(button.classList.contains('w-full')).toBe(true);
  });

  it('clicks when enabled and not when disabled', () => {
    const { fixture, host, button } = setup();

    button.click();
    host.disabled.set(true);
    fixture.detectChanges();
    button.click();

    expect(button.disabled).toBe(true);
    expect(host.clicks).toBe(1);
  });
});
