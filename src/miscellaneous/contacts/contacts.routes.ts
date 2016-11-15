import {ContactsComponent} from './contacts.component';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
    {
        path: '', component: ContactsComponent
    }
];

export default RouterModule.forChild(routes);
