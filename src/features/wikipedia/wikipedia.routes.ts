import {RouterModule, Routes} from '@angular/router';
import {WikipediaComponent} from './wikipedia.component';

const routes: Routes = [
    {
        path: '', component: WikipediaComponent
    }
];

export default RouterModule.forChild(routes);
