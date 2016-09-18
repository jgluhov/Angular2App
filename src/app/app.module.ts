import {NgModule, Component} from '@angular/core';
import {BrowserModule}  from '@angular/platform-browser';
import {AppComponent} from './app.component';
import RouterModule from './app.routes';
import {HomeComponent} from '../home/home.component';

@NgModule({
    imports: [BrowserModule, RouterModule],
    declarations: [AppComponent, HomeComponent],
    bootstrap: [AppComponent]
})

export class AppModule {}
