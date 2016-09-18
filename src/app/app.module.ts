import {NgModule} from '@angular/core';
import {BrowserModule}  from '@angular/platform-browser';
import {AppComponent} from './app.component';
import RouterModule from './app.routes';
import {HomeComponent} from '../home/home.component';
import {ContactsComponent} from "../contacts/contacts.component";

@NgModule({
    imports: [BrowserModule, RouterModule],
    declarations: [AppComponent, HomeComponent, ContactsComponent],
    bootstrap: [AppComponent]
})

export class AppModule {}
