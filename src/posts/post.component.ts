import {Component} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import "rxjs/add/operator/map";
import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/startWith";
import "rxjs/add/operator/share";

import {Http} from "@angular/http";

@Component({
    templateUrl: './post.component.html'
})

export class PostComponent{
    post$:any;

    constructor(private route:ActivatedRoute, private http:Http) {
        this.post$ = route.params
            .map((p:any) => p.id)
            .switchMap((id:any) =>
                http.get(`http://jsonplaceholder.typicode.com/posts/${id}`).map(res => res.json())
            )
            .share()
            .startWith({title: '', body: ''});
    }
}