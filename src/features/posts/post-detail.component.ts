import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {PostsService} from './posts.service';

@Component({
  templateUrl: 'post-detail.component.html'
})

export class PostDetailComponent implements OnInit, OnDestroy {
  post: Object;
  subscription: Subscription;

  constructor(private route: ActivatedRoute, private service: PostsService) {
  }

  ngOnInit() {
    this.subscription = this.service
      .getPost(this.route.params.map((params: any) => params.id))
      .subscribe((post: Object) => this.post = post);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
