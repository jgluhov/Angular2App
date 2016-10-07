import {Injectable} from '@angular/core';
import {
    Http, Headers,
    URLSearchParams,
    Response, RequestOptions
} from '@angular/http';

import {AuthGitHub} from './auth-github.service';

import {Observable} from "rxjs";
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/pluck';

@Injectable()
export class AuthService {
    authenticated: boolean;

    constructor(private http: Http, private authGitHub: AuthGitHub) {
        if(this.jwt) {
            this.authenticated = true;
        }
    }

    signIn() {
        let params = new URLSearchParams();

        params.set('client_id', this.authGitHub.id);
        params.set('scope', this.authGitHub.scope);
        params.set('state', this.authGitHub.state);
        params.set('redirect_uri', this.callbackUrl);

        window.location.replace(this.authGitHub.authorizeUrl + '?' + params.toString());
    }

    jwtHandler(queryParams$ : Observable<Object>) {

        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({headers: headers});

        const params: any = {
            'client_id': this.authGitHub.id,
            'client_secret': this.authGitHub.secret
        };

        return queryParams$
            .map((queryParams: any) => {
                params.code = queryParams.code;
                params.state = queryParams.state;
            })
            .switchMap(() => this.http.post(this.accessUrl, JSON.stringify(params), options)
                .map((res:Response) => res.json())
            )
            .pluck('access_token')
            .do((jwt: string) => this.jwt = jwt)
            .switchMap(() => {
                headers.append('Authorization', `token ${this.jwt}`);
                return this.http.get(this.authGitHub.userUrl, {headers})
                    .map((res: Response) => res.json());
            })
            .map(user => this.user = user)
            .do(() => this.authenticated = true)
    }

    signOut() {
        localStorage.removeItem('jwt');
        localStorage.removeItem('profile');

        this.authenticated = false;
    }

    get jwt() {
        return localStorage.getItem('jwt');
    }
    set jwt(jwt: string) {
        localStorage.setItem('jwt', jwt);
    }

    get user() {
        return JSON.parse(localStorage.getItem('profile'));
    }

    set user(user: Object) {
        localStorage.setItem('profile', JSON.stringify(user));
    }

    get callbackUrl() {
        return `${location.origin}/auth/secure`;
    }

    get accessUrl() {
        return `http://${location.hostname}:8000/access_token`;
    }

    set redirectUrl(url: string) {
        localStorage.setItem('redirectUrl', url);
    }

    get redirectUrl() {
        return localStorage.getItem('redirectUrl');
    }
}
