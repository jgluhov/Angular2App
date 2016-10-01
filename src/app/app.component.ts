import {Component} from '@angular/core';

@Component({
    selector: 'app',
    templateUrl: './app.component.html'
})

export class AppComponent {
    navs = [
        {url: '', content: 'Home'},
        {url: 'posts', content: 'Posts'},
        {url: 'wikipedia', content: 'Wikipedia'},
        {url: 'contacts', content: 'Contacts'},
        {url: 'github', content: 'Github'},
        {url: 'login', content: 'Login'}
    ]
}