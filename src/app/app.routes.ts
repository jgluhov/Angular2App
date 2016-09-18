import {RouterModule} from "@angular/router";

const routes = [
    {
        path: '',
        loadChildren: () => new Promise((resolve) => {
            (require as any)(['../home/home.module'], (module: any) => resolve(module.HomeModule));
        })
    },
    {
        path: 'contacts',
        loadChildren: () => new Promise((resolve) => {
            (require as any)(['../contacts/contacts.module'], (module: any) => resolve(module.ContactsModule))
        })
    }
];

export default RouterModule.forRoot(routes);
