import {HomeComponent} from './home.component';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
    {
        path: '', component: HomeComponent
    }
];

export default RouterModule.forChild(routes);
