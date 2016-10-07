import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {AuthService} from "./auth.service";

import {Subscription} from 'rxjs';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

@Component({
    template: 'Auth Secure'
})

export class AuthSecureComponent implements OnInit, OnDestroy {
    constructor(private authService: AuthService, private route: ActivatedRoute) {}
    subscription: Subscription;

    ngOnInit() {
        this.subscription = this.authService.jwtHandler(this.route.queryParams)
            .subscribe(data => console.log.bind(console));
              
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
