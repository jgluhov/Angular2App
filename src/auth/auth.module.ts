import {NgModule} from "@angular/core";
import {AuthComponent} from "./auth.component";
import authRoutes from './auth.routes';
import {AuthSecureComponent} from "./auth-secure.component";
import {AuthGitHub} from "./auth-github.service";
import {AuthSecureGuard} from "./auth-secure-guard.service";

@NgModule({
    imports: [authRoutes],
    declarations: [
        AuthComponent,
        AuthSecureComponent
    ],
    providers: [
        AuthGitHub,
        AuthSecureGuard
    ]
})

export class AuthModule {}