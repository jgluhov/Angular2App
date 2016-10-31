import {RouterModule, Routes} from '@angular/router';
import {PostsComponent} from './posts.component';
import {PostDetailComponent} from './post-detail.component';

const routes: Routes = [
    {
        path: '', component: PostsComponent
    },
    {
        path: ':id', component: PostDetailComponent
    }
];

export default RouterModule.forChild(routes);
