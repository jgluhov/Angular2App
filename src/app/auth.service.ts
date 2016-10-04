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
    localAccessToken: string = 'http://localhost:8000/access_token';

    login() {
        let params = new URLSearchParams();

        params.set('client_id', 'c6af84231105fd56d3b1');
        params.set('scope', 'user');
        params.set('state', sha256('Angular2' + new Date().valueOf()));
        params.set('redirect_uri', 'http://localhost/login/secure');

        window.location.replace(this.gitHubAccess + '?' + params.toString());
    }

    tokenHandler(queryParams$ : Observable<any>) {

        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({headers: headers});
        const params: any = {
            'client_id': 'c6af84231105fd56d3b1',
            'client_secret': '75795fca8c222575140082360ddd02c4d007c51f'
        };

        return queryParams$
            .map((queryParams: any) => {
                params.code = queryParams.code;
                params.state = queryParams.state;
            })
            .switchMap(body => this.http.post(this.localAccessToken, JSON.stringify(params), options)
            .map((res:Response) => res.json()));
    }

    logout() {
        this.isLoggedIn = false;
    }
}
