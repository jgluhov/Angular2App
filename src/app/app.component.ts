import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../auth/auth.service';

@Component({
  selector: 'app',
  templateUrl: './app.component.html'
})

export class AppComponent {
  navs = [
    {url: '', content: 'Home'},
    {url: 'posts', content: 'Posts'},
    {url: 'wikipedia', content: 'Wikipedia'},
    {url: 'contacts', content: 'Contacts'},
    {url: 'github', content: 'GitHub'},
    {url: 'spaceship', content: 'Spaceship'},
    {url: 'counter', content: 'Counter'},
    {url: 'animation', content: 'Animation'}
  ];

  constructor(private authService: AuthService, private router: Router) {
  }

  onSignIn() {
    this.authService.redirectUrl = this.router.routerState.snapshot.url;

    this.router.navigate(['/auth']);
  }
}
