import {Component, OnInit} from '@angular/core';
import {PostsService} from './posts.service';

import {Observable} from 'rxjs';

@Component({
  templateUrl: './posts.component.html'
})

export class PostsComponent implements OnInit {
  posts$: Observable<Array<Object>>;

  constructor(private service: PostsService) {
  }

  ngOnInit() {
    this.posts$ = this.service.getPosts();
  }
}
