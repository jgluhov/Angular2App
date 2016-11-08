import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../auth/auth-guard.service';
import {ProfileComponent} from '../profile/profile.component';

const routes: Routes = [
  {
    path: 'posts',
    loadChildren: '../posts/posts.module#PostsModule'
  },
  {
    path: 'wikipedia',
    loadChildren: '../wikipedia/wikipedia.module#WikipediaModule'
  },
  {
    path: 'contacts',
    loadChildren: '../contacts/contacts.module#ContactsModule'
  },
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
    path: 'spaceship',
    loadChildren: '../spaceship/spaceship.module#SpaceshipModule'
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'breakout',
    loadChildren: '../breakout/breakout.module#BreakoutModule'
  },
  {
    path: 'counter',
    loadChildren: '../counter/counter.module#CounterModule'
  },
  {
    path: 'animation',
    loadChildren: '../animation/animation.module#AnimationModule'
  },
  {
    path: '',
    loadChildren: '../home/home.module#HomeModule'
  }
];

export default RouterModule.forRoot(routes);
