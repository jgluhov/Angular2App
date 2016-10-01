import {NgModule} from "@angular/core";
import {LoginComponent} from "./login.component";
import loginRoutes from './login.routes';

@NgModule({
    imports: [loginRoutes],
    declarations: [LoginComponent]
})

export class LoginModule {}