import {Injectable} from '@angular/core';
import {Http, Headers, Response} from '@angular/http';

import {Subject} from 'rxjs';
import {AuthService} from "../auth/auth.service";

@Injectable()
export class GitHubService {
    private headers: Headers;
    private _repos$: Subject<any[]>;
    private reposUrl: string = 'https://api.github.com/user/repos';
    private reposStore: {
        repos: any[]
    };

    constructor(private http: Http, private authService: AuthService) {
        this.headers = new Headers({'Authorization': `token ${authService.jwt}`});
        this._repos$ = <Subject<any[]>>new Subject();
        this.reposStore = { repos: [] };
    }

    get repos$() {
        return this._repos$.asObservable();
    }

    loadRepos() {
        this.http.get(this.reposUrl, {headers: this.headers})
            .map((res: Response) => res.json())
            .subscribe(repos => {
                this.reposStore.repos = repos;
                this._repos$.next(this.reposStore.repos);
            }, error => console.log('Could not load feeds'));

    }
}
