import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../auth/auth-guard.service';
import {ProfileComponent} from '../profile/profile.component';

const routes: Routes = [
  {
    path: 'posts',
    data: {
      name: 'Posts'
    },
    loadChildren: '../posts/posts.module#PostsModule'
  },
  {
    path: 'wikipedia',
    data: {
      name: 'Wikipedia'
    },
    loadChildren: '../wikipedia/wikipedia.module#WikipediaModule'
  },
  {
    path: 'contacts',
    data: {
      name: 'Contacts'
    },
    loadChildren: '../contacts/contacts.module#ContactsModule'
  },
  {
    path: 'github',
    data: {
      name: 'GitHub'
    },
    canActivate: [AuthGuard],
    loadChildren: '../github/github.module#GitHubModule'
  },
  {
    path: 'auth',
    loadChildren: '../auth/auth.module#AuthModule'
  },
  {
    path: 'spaceship',
    data: {
      name: 'Spaceship'
    },
    loadChildren: '../spaceship/spaceship.module#SpaceshipModule'
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'counter',
    data: {
      name: 'Counter'
    },
    loadChildren: '../counter/counter.module#CounterModule'
  },
  {
    path: '',
    data: {
      name: 'Home'
    },
    loadChildren: '../home/home.module#HomeModule'
  }
];

export default RouterModule.forRoot(routes);
