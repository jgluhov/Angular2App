import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../auth/auth-guard.service';
import {ProfileComponent} from '../profile/profile.component';

export const commonRoutes: Routes = [
  {
    path: 'github',
    canActivate: [AuthGuard],
    loadChildren: '../github/github.module#GitHubModule'
  },
  {
    path: 'auth',
    loadChildren: '../auth/auth.module#AuthModule'
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: '',
    loadChildren: '../home/home.module#HomeModule'
  }
];

export const gameRoutes: Routes = [
  {
    path: 'spaceship',
    loadChildren: '../games/spaceship/spaceship.module#SpaceshipModule'
  },
  {
    path: 'breakout',
    loadChildren: '../games/breakout/breakout.module#BreakoutModule'
  }
];

export const miscellaneousRoutes: Routes = [
  {
    path: 'posts',
    loadChildren: '../miscellaneous/posts/posts.module#PostsModule'
  },
  {
    path: 'wikipedia',
    loadChildren: '../miscellaneous/wikipedia/wikipedia.module#WikipediaModule'
  },
  {
    path: 'contacts',
    loadChildren: '../miscellaneous/contacts/contacts.module#ContactsModule'
  },
  {
    path: 'counter',
    loadChildren: '../miscellaneous/counter/counter.module#CounterModule'
  },
  {
    path: 'animation',
    loadChildren: '../miscellaneous/animation/animation.module#AnimationModule'
  }
];

const routes: Routes = [
  ...commonRoutes,
  ...gameRoutes,
  ...miscellaneousRoutes
];

export default RouterModule.forRoot(routes);
