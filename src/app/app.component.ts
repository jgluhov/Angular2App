import {Component} from '@angular/core';

@Component({
    selector: 'app',
    templateUrl: './app.component.html'
})

export class AppComponent {
    navs = [
        {url: '', content: 'Home'},
        {url: 'contacts', content: 'Contacts'},
        {url: 'contacts/1', content: 'One'}
    ]
}