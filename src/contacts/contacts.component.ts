import {Component} from '@angular/core';

@Component({
    templateUrl: './contacts.component.html'
})

export class ContactsComponent {
    username:string;

    onSubmit(formValue: Object) {
        console.log(formValue);
    }
}
