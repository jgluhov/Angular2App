import {Component} from '@angular/core';
import {Router, Routes} from '@angular/router';

import animations from './navbar.animations';

import * as Immutable from 'immutable';

import {Observable} from 'rxjs';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/pluck';
import 'rxjs/add/operator/reduce';
import 'rxjs/add/operator/groupBy';
import 'rxjs/add/operator/toArray';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/publishReplay';

import {
  commonRoutes,
  miscellaneousRoutes,
  gameRoutes
} from '../app/app.routes';

import {AuthService} from '../auth/auth.service';
import {NavbarService} from './navbar.service';

@Component({
  selector: 'navbar',
  animations: animations,
  templateUrl: './navbar.component.html'
})

export class NavbarComponent {
  itemState: string;
  navbar$: Observable<any>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private navbarService: NavbarService
  ) {
    this.navbar$ = this.composeNavbar$();
  }

  composeNavbar$() {
    return Observable.combineLatest(
      this.items$, this.dropdowns$,
      (items, dropdowns) => ({
        items: items,
        dropdowns: dropdowns
      }))
      .publishReplay()
      .refCount();
  }

  composeDropdown$(routes: Routes, category: string) {
    return Observable.from(routes)
      .filter(route => route.path.length > 0)
      .map(route => ({
          url: route.path,
          name: route.path
      }))
      .reduce((items, item) => items.push(item), Immutable.List())
      .map(items => ({
        name: category,
        items: items
      }));
  }

  get items$() {
    return Observable.from(commonRoutes)
      .filter(route => route.path.length > 0)
      .map(route => ({
        url: route.path,
        name: route.path
      }))
      .reduce((items, item) => items.set(item.url, item), Immutable.Map());
  }

  get dropdowns$() {
    return Observable.concat(
      this.composeDropdown$(miscellaneousRoutes, 'miscellaneous'),
      this.composeDropdown$(gameRoutes, 'games')
    ).toArray();
  }

  onSignIn() {
    this.authService.redirectUrl = this.router.routerState.snapshot.url;

    this.router.navigate(['/auth']);
  }
}
