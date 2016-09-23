import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {PostsService} from "./posts.service";

import 'rxjs/add/operator/map';
import {Subscription} from "rxjs";

@Component({
    templateUrl: './posts.component.html'
})

export class PostsComponent implements OnInit, OnDestroy {
    items: Array<Object>;
    posts$ = new Subject();
    postsSubscription: Subscription;

    constructor(private service: PostsService) {}

    ngOnInit() {
        this.postsSubscription = this.service.getPosts(this.posts$)
            .subscribe(results => this.items = results);

        this.posts$.next();
    }

    ngOnDestroy() {
        this.postsSubscription.unsubscribe();
    }
}