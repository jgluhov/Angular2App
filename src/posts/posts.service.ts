import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs";

@Injectable()
export class PostsService {
    hostUrl: string = 'http://jsonplaceholder.typicode.com/posts';
    constructor(private http: Http) {};

    getPosts(observer: Observable<any>) {
        return observer.switchMap(() => this.http.get(this.hostUrl).map(res => res.json()))
    }
}