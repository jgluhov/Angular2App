import {NgModule} from '@angular/core';
import {BrowserModule}  from '@angular/platform-browser';
import {AppComponent} from './app.component';
import appRoutes from './app.routes';
import {AuthGuard} from "./auth-guard.service";
import {AuthService} from "./auth.service";

@NgModule({
    imports: [BrowserModule, appRoutes],
    declarations: [AppComponent],
    bootstrap: [AppComponent],
    providers: [AuthGuard, AuthService]
})

export class AppModule {}
