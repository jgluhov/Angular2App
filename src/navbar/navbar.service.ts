import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

@Injectable()
export class NavbarService {
  constructor(private router: Router) {}

  isActiveRoute(route: string) {
    return (this.router.isActive(route, true)) ? 'active' : 'inactive';
  }
}
