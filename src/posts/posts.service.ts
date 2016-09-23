import {Injectable} from "@angular/core";
import {Http} from "@angular/http";

import {Observable, Subject} from "rxjs";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/startWith';

@Injectable()
export class PostsService {
    hostUrl: string = 'http://jsonplaceholder.typicode.com/posts';

    constructor(private http: Http) {};

    getPosts(subject: Subject<any>) {
        return subject.switchMap(() => this.http.get(this.hostUrl).map(res => res.json()))
    }

    getPost(id$: Observable<string>) {
        return id$
            .switchMap((id: string) => this.http.get(this.hostUrl + '/' + id).map(res => res.json()))
            .startWith({title: '', body: ''});
    }
}