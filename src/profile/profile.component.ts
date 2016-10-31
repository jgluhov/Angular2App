import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../auth/auth.service';

@Component({
    templateUrl: './profile.component.html'
})

export class ProfileComponent {
    user: Object;
    constructor(private authService: AuthService, private router: Router) {
        this.user = authService.user;
    }

    onSignOut() {
        this.authService.signOut();
        this.router.navigate(['/']);
    }
}
