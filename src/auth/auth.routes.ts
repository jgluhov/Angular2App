import {RouterModule, Routes} from '@angular/router';
import {AuthComponent} from './auth.component';
import {AuthSecureComponent} from "./auth-secure.component";
import {AuthSecureGuard} from './auth-secure-guard.service';

const routes: Routes = [
    {
        path: '', component: AuthComponent
    },
    {
        path: 'secure', component: AuthSecureComponent, canActivate: [AuthSecureGuard],
    }
];

export default RouterModule.forChild(routes);
