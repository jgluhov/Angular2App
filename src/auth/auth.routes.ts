import {RouterModule, Routes} from '@angular/router';
import {AuthComponent} from './auth.component';
import {AuthSecureComponent} from "./auth-secure.component";

const routes: Routes = [
    {
        path: '', component: AuthComponent
    },
    {
        path: 'secure', component: AuthSecureComponent
    }
];

export default RouterModule.forChild(routes);
