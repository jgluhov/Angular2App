import {Component, Inject} from '@angular/core';
import {Store} from 'redux';
import {AppState} from '../app/app-state';
import {AppStore} from '../app/app-store';
import * as CounterActions from './counter-action-creators';

@Component({
  templateUrl: './counter.component.html',
})

export class CounterComponent {
  counter: number;

  constructor(@Inject(AppStore) private store: Store<AppState>) {
    store.subscribe(() => this.readState());
    this.readState();
  }

  readState() {
    const state: AppState = this.store.getState() as AppState;
    this.counter = state.counter;
  }

  increment() {
    this.store.dispatch(CounterActions.increment());
  }

  decrement() {
    this.store.dispatch(CounterActions.decrement());
  }
}
