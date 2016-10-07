import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from "./auth.service";

import {Subscription} from 'rxjs';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

@Component({
    template: 'Auth Secure'
})

export class AuthSecureComponent implements OnInit, OnDestroy {
    constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router) {}
    subscription: Subscription;

    ngOnInit() {
        this.subscription = this.authService.jwtHandler(this.route.queryParams)
            .subscribe(() => {
                this.router.navigate([this.authService.redirectUrl]);
            });
              
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
