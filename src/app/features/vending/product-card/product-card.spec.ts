import { TestBed } from '@angular/core/testing';
import type { Product } from '@core/models/product.model';
import { VendingProductCard } from './product-card';

const product: Product = { id: '1', title: 'Cola', priceCents: 150, stock: 3, image: null };

describe('VendingProductCard', () => {
  const setup = (value: Product) => {
    const fixture = TestBed.createComponent(VendingProductCard);
    fixture.componentRef.setInput('product', value);
    fixture.detectChanges();
    const selected = vi.fn();
    fixture.componentInstance.selected.subscribe(selected);
    return { host: fixture.nativeElement as HTMLElement, selected };
  };

  it('selects an available product on click', () => {
    const { host, selected } = setup(product);

    host.click();

    expect(selected).toHaveBeenCalledTimes(1);
  });

  it('selects an available product with Enter and Space', () => {
    const { host, selected } = setup(product);

    host.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    host.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));

    expect(selected).toHaveBeenCalledTimes(2);
  });

  it('exposes button semantics', () => {
    const { host } = setup(product);

    expect(host.getAttribute('role')).toBe('button');
    expect(host.getAttribute('tabindex')).toBe('0');
    expect(host.getAttribute('aria-disabled')).toBe('false');
    expect(host.querySelector('button')).toBeNull();
  });

  it('does not select a sold-out product', () => {
    const { host, selected } = setup({ ...product, stock: 0 });

    host.click();
    host.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

    expect(selected).not.toHaveBeenCalled();
    expect(host.getAttribute('aria-disabled')).toBe('true');
    expect(host.getAttribute('tabindex')).toBe('-1');
  });
});
