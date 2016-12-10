import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {BrowserModule}  from '@angular/platform-browser';
import {AppComponent} from './app.component';
import appRoutes from './app.routes';
import {AuthGuard} from '../auth/auth-guard.service';
import {AuthService} from '../auth/auth.service';
import {AuthGitHub} from '../auth/auth-github.service';
import {ProfileComponent} from '../profile/profile.component';

import {
  AppStore,
  store
} from './app-store';

import {NavbarModule} from '../navbar/navbar.module';
import {NgSpinningPreloader} from 'ng2-spinning-preloader';



@NgModule({
  imports: [BrowserModule, appRoutes, HttpModule, NavbarModule],
  declarations: [AppComponent, ProfileComponent],
  bootstrap: [AppComponent],
  providers: [
    AuthGuard,
    AuthService,
    AuthGitHub,
    NgSpinningPreloader,
    {
      provide: AppStore, useValue: store
    }
  ]
})

export class AppModule {
}
