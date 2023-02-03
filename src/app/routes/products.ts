import { AsyncPipe, NgFor } from "@angular/common";
import { Component } from "@angular/core";

import { injectProductsFeature } from "../store/products";

@Component({
  template: `
    <h2>Products</h2>

    <ul>
      <li *ngFor="let product of products$ | async">
        {{ product.name }}
      </li>
    </ul>
  `,
  standalone: true,
  imports: [AsyncPipe, NgFor]
})
export default class ProductsComponent {
  readonly vm = injectProductsFeature();
  readonly products$ = this.vm.products$;

  ngOnInit() {
    this.vm.enter();
  }
}