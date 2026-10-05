import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Product } from '@core/models/product.model';
import { Response } from '@core/models/response.model';

@Injectable({ providedIn: 'root' })
export class ProductsApi {
  private readonly http = inject(HttpClient);

  fetchProducts(): Observable<Product[]> {
    return this.http
      .get<Response<Product[]>>('mock-api/products.json')
      .pipe(map((response) => response.data));
  }
}
