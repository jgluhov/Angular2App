import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ContactsComponent} from "./contacts.component";
import ContactsRoutes from './contacts.routes'
import {ContactComponent} from "./contact.component";
import {HttpModule} from "@angular/http";

@NgModule({
    imports: [CommonModule, ContactsRoutes, HttpModule],
    declarations: [ContactsComponent, ContactComponent]
})

export class ContactsModule {}