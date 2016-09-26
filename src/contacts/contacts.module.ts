import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ContactsComponent} from './contacts.component';
import ContactsRoutes from './contacts.routes';

@NgModule({
    imports: [FormsModule, ContactsRoutes],
    declarations: [ContactsComponent]
})

export class ContactsModule {}
