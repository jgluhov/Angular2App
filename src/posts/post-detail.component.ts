import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs";
import {PostsService} from "./posts.service";

@Component({
    templateUrl: 'post-detail.component.html'
})

export class PostDetailComponent implements OnInit {
    post: Object;

    constructor(private route: ActivatedRoute, private service: PostsService) {}

    ngOnInit() {
        this.service.getPost(this.route.params.map((params: any) => params.id))
            .subscribe((post: Object) => this.post = post);
    }
}