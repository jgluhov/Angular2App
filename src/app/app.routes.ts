import {RouterModule} from "@angular/router";

const routes = [
    {
        path: '',
        loadChildren: () => new Promise((resolve) => {
            (require as any)(['../home/home.module'], (module: any) => resolve(module.HomeModule));
        })
    },
    {
        path: 'posts',
        loadChildren: () => new Promise((resolve) => {
            (require as any)(['../posts/posts.module'], (module: any) => resolve(module.PostsModule))
        })
    }
];

export default RouterModule.forRoot(routes);
