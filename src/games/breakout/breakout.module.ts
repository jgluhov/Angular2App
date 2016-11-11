import {NgModule} from '@angular/core';
import {BreakoutComponent} from './breakout.component';
import breakoutRoutes from './breakout.routes';

@NgModule({
  imports: [breakoutRoutes],
  declarations: [BreakoutComponent]
})

export class BreakoutModule {
}
