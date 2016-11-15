import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import {Observable} from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';

@Injectable()
export class PostsService {
  hostUrl: string = 'http://jsonplaceholder.typicode.com/posts';

  constructor(private http: Http) {
  };

  getPosts(): Observable<Array<Object>> {
    return this.http.get(this.hostUrl).map(res => res.json());
  }

  getPost(id$: Observable<string>): Observable<Object> {
    return id$
      .switchMap(id => this.http.get(this.hostUrl + '/' + id).map(res => res.json()))
      .startWith({id: '', title: '', body: ''});
  }
}
