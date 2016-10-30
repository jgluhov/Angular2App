import {RouterModule, Routes} from "@angular/router";
import {CounterComponent} from "./counter.component";

const routes: Routes = [
    {
        path: '', component: CounterComponent
    }
];

export default RouterModule.forChild(routes);