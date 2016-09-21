import {Component} from '@angular/core';
import {Http} from "@angular/http";
import 'rxjs/add/operator/map';

@Component({
    templateUrl: 'posts.component.html'
})

export class PostsComponent {
    posts$: any;

    constructor(private http: Http) {
        this.posts$ = http.get('http://jsonplaceholder.typicode.com/posts').map(res => res.json());
    }
}