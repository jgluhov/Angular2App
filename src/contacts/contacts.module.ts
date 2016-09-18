import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ContactsComponent} from "./contacts.component";
import ContactsRoutes from './contacts.routes'
import {ContactComponent} from "./contact.component";

@NgModule({
    imports: [CommonModule, ContactsRoutes],
    declarations: [ContactsComponent, ContactComponent]
})

export class ContactsModule {}