export interface Product {
  id: string;
  title: string;
  priceCents: number;
  stock: number;
  image: string | null;
}

export type ProductFormValue = Omit<Product, 'id' | 'image'>;
