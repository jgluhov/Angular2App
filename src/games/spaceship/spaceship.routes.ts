import {Routes, RouterModule} from '@angular/router';
import {SpaceshipComponent} from './spaceship.component';

const routes: Routes = [
    {
        path: '', component: SpaceshipComponent
    },
];

export default RouterModule.forChild(routes);
