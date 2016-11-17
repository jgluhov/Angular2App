import {Routes, RouterModule} from '@angular/router';
import {DynamicFormComponent} from './dynamic-form.component';

const routes: Routes = [
  {
    path: '', component: DynamicFormComponent
  }
];

export default RouterModule.forChild(routes);
