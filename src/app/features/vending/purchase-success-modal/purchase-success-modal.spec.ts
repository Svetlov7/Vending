import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { TestBed } from '@angular/core/testing';
import type { Product } from '@core/models/product.model';
import {
  PURCHASE_SUCCESS_TIMEOUT_MS,
  PurchaseSuccessModal,
} from './purchase-success-modal';

const product: Product = { id: '1', title: 'Cola', priceCents: 150, stock: 3, image: null };

describe('PurchaseSuccessModal', () => {
  const setup = (changeCents: number) => {
    const dialogRef = { close: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        { provide: DialogRef, useValue: dialogRef },
        { provide: DIALOG_DATA, useValue: { product, changeCents } },
      ],
    });
    const fixture = TestBed.createComponent(PurchaseSuccessModal);
    fixture.detectChanges();
    return { fixture, host: fixture.nativeElement as HTMLElement, dialogRef };
  };

  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('shows the product and change coins with counts only above one', () => {
    const { host } = setup(580);

    expect(host.textContent).toContain('Cola');
    const coins = Array.from(host.querySelectorAll('app-coin'));
    expect(coins.map((coin) => coin.querySelector('span')?.textContent?.trim())).toEqual([
      '€2.00',
      '€1.00',
      '€0.50',
      '€0.20',
      '€0.10',
    ]);
    const badges = coins.map((coin) => coin.querySelectorAll('span')[1]?.textContent?.trim());
    expect(badges).toEqual(['×2', undefined, undefined, undefined, undefined]);
  });

  it('shows "No change" when there is no change', () => {
    const { host } = setup(0);

    expect(host.textContent).toContain('No change');
    expect(host.querySelector('app-coin')).toBeNull();
  });

  it('closes via the Get purchase button', () => {
    const { host, dialogRef } = setup(0);

    const button = Array.from(host.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Get purchase'),
    );
    button?.click();

    expect(dialogRef.close).toHaveBeenCalledTimes(1);
  });

  it('closes via the X button', () => {
    const { host, dialogRef } = setup(0);

    host.querySelector<HTMLButtonElement>('button[aria-label="Close modal"]')?.click();

    expect(dialogRef.close).toHaveBeenCalledTimes(1);
  });

  it('closes automatically after 15 seconds', () => {
    const { dialogRef } = setup(0);

    vi.advanceTimersByTime(PURCHASE_SUCCESS_TIMEOUT_MS - 1);
    expect(dialogRef.close).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(dialogRef.close).toHaveBeenCalledTimes(1);
  });

  it('clears the timer when destroyed', () => {
    const { fixture, dialogRef } = setup(0);

    fixture.destroy();
    vi.advanceTimersByTime(PURCHASE_SUCCESS_TIMEOUT_MS);

    expect(dialogRef.close).not.toHaveBeenCalled();
  });
});
