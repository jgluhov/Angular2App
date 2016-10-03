import {NgModule} from "@angular/core";
import {LoginComponent} from "./login.component";
import loginRoutes from './login.routes';
import {LoginSecureComponent} from "./login-secure.component";

@NgModule({
    imports: [loginRoutes],
    declarations: [LoginComponent, LoginSecureComponent]
})

export class LoginModule {}