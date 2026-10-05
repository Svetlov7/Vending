import { Component } from '@angular/core';
import { ProductGrid } from './product-grid/product-grid';

@Component({
  selector: 'app-vending-machine',
  imports: [ProductGrid],
  templateUrl: './vending-machine.html',
})
export class VendingMachine {}
