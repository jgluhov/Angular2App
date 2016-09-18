import {HomeComponent} from '../home/home.component';
import {ContactsComponent} from '../contacts/contacts.component';
import {RouterModule} from "@angular/router";

const routes = [
    {
        path: '', component: HomeComponent
    },
    {
        path: 'contacts', component: ContactsComponent
    }
];

export default RouterModule.forRoot(routes);
