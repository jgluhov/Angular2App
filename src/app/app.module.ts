import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {BrowserModule}  from '@angular/platform-browser';
import {AppComponent} from './app.component';
import appRoutes from './app.routes';
import {AuthGuard} from '../auth/auth-guard.service';
import {AuthService} from '../auth/auth.service';
import {AuthGitHub} from '../auth/auth-github.service';
import {ProfileComponent} from '../profile/profile.component';
import {NavbarComponent} from '../navbar/navbar.component';
import {
  AppStore,
  store
} from './app-store';

@NgModule({
  imports: [BrowserModule, appRoutes, HttpModule],
  declarations: [AppComponent, ProfileComponent, NavbarComponent],
  bootstrap: [AppComponent],
  providers: [AuthGuard, AuthService, AuthGitHub, {
    provide: AppStore, useValue: store
  }]
})

export class AppModule {
}
