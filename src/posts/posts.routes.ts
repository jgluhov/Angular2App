import {RouterModule, Routes} from "@angular/router";
import {PostsComponent} from "./posts.component";
import {PostComponent} from "./post.component";

const routes: Routes = [
    {
        path: '', component: PostsComponent
    },
    {
        path: ':id', component: PostComponent
    }
];

export default RouterModule.forChild(routes);
