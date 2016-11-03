import {
  Component,
  trigger,
  style,
  state,
  transition,
  animate
} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../auth/auth.service';

@Component({
  selector: 'navbar',
  animations: [
    trigger('itemState', [
      state('inactive', style({
        'color': '#777',
        'transform': 'scale(1)'
      })),
      state('active', style({
        'color': '#333',
        'transform': 'scale(1.05)',
        'font-weight': 600
      })),
      transition('* => active', animate('.1s ease-in')),
      transition('* => inactive', animate('.1s ease-out'))
    ])
  ],
  templateUrl: './navbar.component.html'
})

export class NavbarComponent {
  itemState: string;

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

  isActiveRoute(route: string) {
    return (this.router.isActive(route, true)) ? 'active' : 'inactive';
  }

  onSignIn() {
    this.authService.redirectUrl = this.router.routerState.snapshot.url;

    this.router.navigate(['/auth']);
  }
}
