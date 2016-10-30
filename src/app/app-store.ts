import {OpaqueToken} from '@angular/core';
import {
  createStore,
  Store,
  StoreEnhancer
} from 'redux';
import {AppState} from "./app-state";
import {counterReducer} from "../counter/counter-reducer";

const devtools: StoreEnhancer<AppState> = window['devToolsExtension'] ?
  window['devToolsExtension']() : f => f;

export const store: Store<AppState> = createStore<AppState>(
  counterReducer,
  devtools
);

export const AppStore = new OpaqueToken('App.store');
