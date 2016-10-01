import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "./auth-guard.service";

const routes: Routes = [
    {
        path: 'posts',
        loadChildren: () => new Promise((resolve) => {
            (require as any)(['../posts/posts.module'], (module: any) => resolve(module.PostsModule));
        })
    },
    {
        path: 'wikipedia',
        loadChildren: () => new Promise((resolve) => {
            (require as any)(['../wikipedia/wikipedia.module'], (module: any) => resolve(module.WikipediaModule));
        })
    },
    {
        path: 'contacts',
        loadChildren: () => new Promise((resolve) => {
            (require as any)(['../contacts/contacts.module'], (module: any) => resolve(module.ContactsModule));
        })
    },
    {
        path: 'github',
        canActivate: [AuthGuard],
        loadChildren: () => new Promise((resolve) => {
            (require as any)(['../github/github.module'], (module: any) => resolve(module.GitHubModule));
        })
    },
    {
        path: 'login',
        loadChildren: () => new Promise((resolve) => {
            (require as any)(['../login/login.module'], (module: any) => resolve(module.LoginModule));
        })
    },
    {
        path: '',
        loadChildren: () => new Promise((resolve) => {
            (require as any)(['../home/home.module'], (module: any) => resolve(module.HomeModule));
        })
    }
];

export default RouterModule.forRoot(routes);
