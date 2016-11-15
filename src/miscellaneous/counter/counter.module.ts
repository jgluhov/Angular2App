import {NgModule} from '@angular/core';
import counterRoutes from './counter.routes';
import {CounterComponent} from './counter.component';

@NgModule({
  imports: [counterRoutes],
  declarations: [CounterComponent]
})

export class CounterModule {}
