import {FormsComponent} from './forms.component';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
    {
        path: '', component: FormsComponent
    }
];

export default RouterModule.forChild(routes);
