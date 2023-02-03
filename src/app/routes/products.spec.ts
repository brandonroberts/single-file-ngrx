import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import ProductsComponent from './products';
import { injectProductsFeature } from '../store/products';

vi.mock(
  '../store.products',
  (): { injectProductsFeature: typeof injectProductsFeature } => {
    return {
      injectProductsFeature: () => ({
        enter: () => {},
        products$: of([]),
      }),
    };
  }
);

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, ProductsComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(ProductsComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
