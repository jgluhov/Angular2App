import {RouterModule, Routes} from "@angular/router";

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
        path: 'forms',
        loadChildren: () => new Promise((resolve) => {
            (require as any)(['../contacts/contacts.module'], (module: any) => resolve(module.ContactsModule));
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
