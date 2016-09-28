import {Component, ViewChild, AfterViewInit} from '@angular/core';
import {NgForm} from '@angular/forms'

import {Observable} from 'rxjs';
import 'rxjs/add/observable/combineLatest'
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/share';

@Component({
    templateUrl: './contacts.component.html'
})

export class ContactsComponent implements AfterViewInit{
    @ViewChild('formRef') form: NgForm;

    locations: Array<String> = ['home', 'away'];
    location: String = _.first(this.locations);

    formStatus$: Observable<Object>;

    onSubmit(formValue: Object) {
        console.log(formValue);
    }

    ngAfterViewInit() {
        this.formStatus$ = Observable.combineLatest(
            this.form.statusChanges,
            this.form.valueChanges, (status, value) => ({status, value})
        );
    }
}
