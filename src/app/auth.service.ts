import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {sha256} from 'js-sha256';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import {URLSearchParams} from "@angular/http";
import {Observable} from "rxjs";


@Injectable()
export class AuthService {

    constructor(private http: Http) {}

    isLoggedIn: boolean = false;

    redirectUrl: string;

    gitHubAccess: string = 'https://github.com/login/oauth/authorize';
    gitHubOAuth: string = 'https://github.com/login/oauth/access_token';

    login() {
        let params = new URLSearchParams();

        params.set('client_id', 'c6af84231105fd56d3b1');
        params.set('scope', 'user');
        params.set('state', sha256('Angular2' + new Date().valueOf()));
        params.set('redirect_uri', 'http://localhost:3000/login/secure');

        window.location.replace(this.gitHubAccess + '?' + params.toString());
    }

    tokenHandler(queryParams$ : Observable<any>) {
        const params = new URLSearchParams();
        const headers = new Headers({ 'Accept': 'application/json' });
        const options = new RequestOptions({headers: headers});

        params.set('client_id', 'c6af84231105fd56d3b1');
        params.set('client_secret', '75795fca8c222575140082360ddd02c4d007c51f');

        return queryParams$
            .map((queryParams: any) => {
                params.set('code', queryParams.code);
                params.set('state', queryParams.state);
            })
            .switchMap(body => this.http.get(this.gitHubOAuth + '?' + params.toString(), options)
            .map((res:Response) => res.json()))
            .catch((error:any) => {
                return Observable.throw(error.json().error || 'Server error')
            });
    }

    logout() {
        this.isLoggedIn = false;
    }
}
