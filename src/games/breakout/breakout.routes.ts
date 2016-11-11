import {RouterModule, Routes} from '@angular/router';
import {BreakoutComponent} from './breakout.component';

const routes: Routes = [
  {
    path: '', component: BreakoutComponent
  }
];

export default RouterModule.forChild(routes);
