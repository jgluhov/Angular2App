import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {BrowserModule}  from '@angular/platform-browser';
import {AppComponent} from './app.component';
import appRoutes from './app.routes';
import {AuthGuard} from "../auth/auth-guard.service";
import {AuthService} from "../auth/auth.service";
import {AuthGitHub} from "../auth/auth.github";

@NgModule({
    imports: [BrowserModule, appRoutes, HttpModule],
    declarations: [AppComponent],
    bootstrap: [AppComponent],
    providers: [AuthGuard, AuthService, AuthGitHub]
})

export class AppModule {}
