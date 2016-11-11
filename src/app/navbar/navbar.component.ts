import {
  Component,
  trigger,
  style,
  state,
  transition,
  animate
} from '@angular/core';
import {Router, Routes, Route} from '@angular/router';
import {AuthService} from '../../auth/auth.service';

import {Observable} from 'rxjs';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/pluck';
import 'rxjs/add/operator/reduce';
import 'rxjs/add/operator/groupBy';
import 'rxjs/add/operator/toArray';
import 'rxjs/add/operator/share';

import {
  commonRoutes,
  featureRoutes,
  gameRoutes
} from '../app.routes';

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
  navbar: any;

  constructor(private authService: AuthService, private router: Router) {
    this.composeNavbar().subscribe(data => this.navbar = data);
  }

  composeNavbar() {
    return Observable.combineLatest(
      this.items$, this.dropdowns$, (items, dropdowns) => {
        return {
          items: items,
          dropdowns: dropdowns
        };
      });
  }

  static toCapitalize(s: string) {
    return s.replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());
  }

  composeRoutes(routes: Routes, category: string) {
    return Observable.from(routes)
      .filter((route: Route) => route.path.length > 0)
      .map((route: Route) => ({
        path: route.path,
        name: NavbarComponent.toCapitalize(route.path),
        category: NavbarComponent.toCapitalize(category)
      }));
  }

  get items$() {
    const composedCommonRoutes$ = this.composeRoutes(commonRoutes, 'common');

    return composedCommonRoutes$
      .reduce((items, item) => Object.assign({}, items, {[item.name.toLowerCase()]: item}), {});
  }

  get dropdowns$() {
    const composedFeaturesRoutes$ = this.composeRoutes(featureRoutes, 'features');
    const composedGameRoutes$ = this.composeRoutes(gameRoutes, 'games');

    return Observable.concat(composedFeaturesRoutes$, composedGameRoutes$)
      .groupBy(route => route.category)
      .flatMap(group => group.reduce((acc, curr) => [...acc, curr], [])
        .map((items) => ({
          category: group.key,
          items: items
        }))
      )
      .toArray();
  }

  isActiveRoute(route: string) {
    return (this.router.isActive(route, true)) ? 'active' : 'inactive';
  }

  onSignIn() {
    this.authService.redirectUrl = this.router.routerState.snapshot.url;

    this.router.navigate(['/auth']);
  }
}
