import { TestBed } from '@angular/core/testing';
import type { Product } from '@core/models/product.model';
import { ProductCardComponent } from './product-card.component';

const product: Product = { id: '1', title: 'Cola', priceCents: 150, stock: 3, image: 'cola.png' };

describe('ProductCardComponent', () => {
  const setup = (value: Product) => {
    const fixture = TestBed.createComponent(ProductCardComponent);
    fixture.componentRef.setInput('product', value);
    fixture.detectChanges();
    return { fixture, el: fixture.nativeElement as HTMLElement };
  };

  it('renders image, title, price and stock', () => {
    const { el } = setup(product);
    const img = el.querySelector('img');

    expect(img?.getAttribute('src')).toBe('cola.png');
    expect(img?.getAttribute('alt')).toBe('Cola');
    expect(el.querySelector('h2')?.textContent?.trim()).toBe('Cola');
    expect(el.textContent).toContain('€1.50');
    expect(el.textContent).toContain('In stock: 3');
  });

  it('renders a placeholder when image is null', () => {
    const { el } = setup({ ...product, image: null });

    expect(el.querySelector('img')).toBeNull();
    expect(el.querySelector('[aria-label="No image available"]')).not.toBeNull();
  });

  it('renders a placeholder when the image fails to load', () => {
    const { fixture, el } = setup(product);

    el.querySelector('img')!.dispatchEvent(new Event('error'));
    fixture.detectChanges();

    expect(el.querySelector('img')).toBeNull();
    expect(el.querySelector('[aria-label="No image available"]')).not.toBeNull();
  });
});
