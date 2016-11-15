import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ContactsComponent} from './contacts.component';
import ContactsRoutes from './contacts.routes';

@NgModule({
    imports: [CommonModule, FormsModule, ContactsRoutes],
    declarations: [ContactsComponent]
})

export class ContactsModule {}
