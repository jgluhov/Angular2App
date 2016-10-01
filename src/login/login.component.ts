import {Component} from '@angular/core';
import {AuthService} from "../app/auth.service";

@Component({
    templateUrl: './login.component.html'
})

export class LoginComponent {
    constructor(private authService: AuthService) {}

    onLogin() {
        this.authService.login();
    }

    onLogout() {
        this.authService.logout();
    }
}
