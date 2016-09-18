import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ContactsComponent} from "./contacts.component";
import ContactsRoutes from './contacts.routes'

@NgModule({
    imports: [CommonModule, ContactsRoutes],
    declarations: [ContactsComponent]
})

export class ContactsModule {}