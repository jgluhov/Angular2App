import {Component} from '@angular/core';
import {Http} from "@angular/http";
import 'rxjs/add/operator/map';

@Component({
    templateUrl: './contacts.component.html'
})

export class ContactsComponent {
    posts$: any;

    constructor(private http: Http) {
        this.posts$ = http.get('http://jsonplaceholder.typicode.com/posts').map(res => res.json());
    }
}