import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import "rxjs/add/operator/map";
import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/startWith";
import "rxjs/add/operator/share";

import {Subscription} from "rxjs";
import {PostsService} from "./posts.service";

@Component({
    templateUrl: 'post-detail.component.html'
})

export class PostDetailComponent implements OnInit, OnDestroy {
    post: Object;
    postSubscription: Subscription;

    constructor(private route: ActivatedRoute, private service: PostsService) {}

    ngOnInit() {
        this.postSubscription = this.service.getPost(this.route.params.map((params: any) => params.id))
            .subscribe(data => this.post = data);
    }

    ngOnDestroy() {
        this.postSubscription.unsubscribe();
    }
}