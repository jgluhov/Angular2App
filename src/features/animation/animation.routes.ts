import {RouterModule, Routes} from '@angular/router';
import {AnimationComponent} from './animation.component';

const routes: Routes = [
  {
    path: '', component: AnimationComponent
  }
];

export default RouterModule.forChild(routes);
