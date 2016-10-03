import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login.component';
import {LoginSecureComponent} from "./login-secure.component";

const routes: Routes = [
    {
        path: '', component: LoginComponent
    },
    {
        path: 'secure', component: LoginSecureComponent
    }
];

export default RouterModule.forChild(routes);
