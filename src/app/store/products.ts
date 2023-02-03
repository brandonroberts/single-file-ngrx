import { createReducer, on, createActionGroup, emptyProps, props, createFeature, createSelector, provideState, Store } from '@ngrx/store';
import { createEffect, Actions, ofType, provideEffects } from '@ngrx/effects';
import { inject, makeEnvironmentProviders } from '@angular/core';
import { exhaustMap, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface Product {
  id: number;
  name: string;
}

export interface ProductsState {
  collection: Product[]
  currentProductId: number | null;
}

export const initialState: ProductsState = {
  collection: [],
  currentProductId: null
};

export const ProductsActions = createActionGroup({
  source: 'Products',
  events: {
    enter: emptyProps(),
    'Product Selected': props<{ id: number }>(),
    'Products Loaded Success': props<{ products: Product[] }>(),
    'Products Loaded Failure': props<{ error: string }>()
  }
});

export const productsFeature = createFeature({
  name: 'products',
  reducer: createReducer(
    initialState,
    on(ProductsActions.enter, (state) => {
      return {
        ...state,
        collection: []
      }
    }),
    on(ProductsActions.productSelected, (state, action) => {
      return {
        ...state,
        currentProductId: action.id
      }
    }),    
    on(ProductsActions.productsLoadedSuccess, (state, action) => {
      return {
        ...state,
        collection: action.products
      };
    })
  ),
  extraSelectors: ({ selectCollection, selectCurrentProductId }) => ({
    selectCurrentProduct: createSelector(
      selectCollection,
      selectCurrentProductId,
      (products, id) => products.find(product => product.id === id)
    )
  })
});

export const {
  selectProductsState,
  selectCollection: selectAllProducts,
  selectCurrentProductId,
  selectCurrentProduct
} = productsFeature;

export const loadProducts$ = createEffect((actions$ = inject(Actions)) => {
  const http = inject(HttpClient);

  return actions$.pipe(
    ofType(ProductsActions.enter),
    exhaustMap(() => 
      http.get<Product[]>('/api/v1/products')
        .pipe(
          map(products => ProductsActions.productsLoadedSuccess({ products }))
        )
    )
  );
}, { functional: true });

export function provideProductsFeature() {
  return makeEnvironmentProviders([
    provideState(productsFeature),
    provideEffects({ loadProducts$ })
  ]);
}

export function injectProductsFeature() {
  const store = inject(Store);

  return {
    enter: () => store.dispatch(ProductsActions.enter()),
    products$: store.select(selectAllProducts)
  }
}
