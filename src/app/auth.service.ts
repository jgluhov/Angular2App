import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';

@Injectable()
export class AuthService {
    isLoggedIn: boolean = false;

    redirectUrl: string;

    login() {
        console.log('login')
        return Observable.of(true).delay(1000).subscribe((value: boolean) => this.isLoggedIn = value);
    }

    logout() {
        this.isLoggedIn = false;
    }
}
