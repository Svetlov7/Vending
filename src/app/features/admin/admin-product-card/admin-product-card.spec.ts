import { Dialog } from '@angular/cdk/dialog';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { Product } from '@core/models/product.model';
import { ProductsStore } from '@state/products.store';
import { AdminPanel } from '../admin-panel';
import { AdminProductCard } from './admin-product-card';

const product: Product = { id: '1', title: 'Cola', priceCents: 150, stock: 3, image: null };

const buttons = (el: HTMLElement) =>
  Array.from(el.querySelectorAll('button')).reduce<Record<string, HTMLButtonElement>>(
    (acc, b) => ({ ...acc, [b.textContent!.trim()]: b }),
    {},
  );

describe('AdminProductCard', () => {
  const setup = () => {
    const fixture = TestBed.createComponent(AdminProductCard);
    fixture.componentRef.setInput('product', product);
    fixture.detectChanges();
    const edit = vi.fn();
    const remove = vi.fn();
    fixture.componentInstance.edit.subscribe(edit);
    fixture.componentInstance.remove.subscribe(remove);
    return { el: fixture.nativeElement as HTMLElement, edit, remove };
  };

  it('Edit emits only edit', () => {
    const { el, edit, remove } = setup();

    buttons(el)['Edit'].click();

    expect(edit).toHaveBeenCalledTimes(1);
    expect(remove).not.toHaveBeenCalled();
  });

  it('Delete emits only remove', () => {
    const { el, edit, remove } = setup();

    buttons(el)['Delete'].click();

    expect(remove).toHaveBeenCalledTimes(1);
    expect(edit).not.toHaveBeenCalled();
  });

  it('clicking the card itself does nothing', () => {
    const { el, edit, remove } = setup();

    el.click();
    el.querySelector('article')!.click();

    expect(edit).not.toHaveBeenCalled();
    expect(remove).not.toHaveBeenCalled();
  });
});

describe('AdminPanel card actions', () => {
  const productsStore = {
    products: signal<Product[]>([product]),
    load: vi.fn(),
    deleteProduct: vi.fn(),
  };
  const dialog = { open: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      imports: [AdminPanel],
      providers: [
        { provide: ProductsStore, useValue: productsStore },
        { provide: Dialog, useValue: dialog },
      ],
    });
  });

  it('Delete calls ProductsStore.deleteProduct without opening the form', () => {
    const fixture = TestBed.createComponent(AdminPanel);
    fixture.detectChanges();

    buttons(fixture.nativeElement)['Delete'].click();

    expect(productsStore.deleteProduct).toHaveBeenCalledWith('1');
    expect(dialog.open).not.toHaveBeenCalled();
  });

  it('Edit opens the form without deleting', () => {
    const fixture = TestBed.createComponent(AdminPanel);
    fixture.detectChanges();

    buttons(fixture.nativeElement)['Edit'].click();

    expect(dialog.open).toHaveBeenCalledTimes(1);
    expect(productsStore.deleteProduct).not.toHaveBeenCalled();
  });
});
