import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {AuthService} from "../app/auth.service";

import {Subscription} from 'rxjs';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

@Component({
    template: 'Login Secure'
})

export class LoginSecureComponent implements OnInit, OnDestroy {
    constructor(private authService: AuthService, private route: ActivatedRoute) {}
    subscription: Subscription;
    ngOnInit() {
        this.subscription = this.authService.tokenHandler(this.route.queryParams)
            .subscribe(data => console.log(data), error => console.error(error));
    }
    ngOnDestroy() {
        this.subscription
            .unsubscribe();
    }
}
