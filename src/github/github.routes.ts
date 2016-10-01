import {RouterModule, Routes} from '@angular/router';
import {GitHubComponent} from "./github.component";

const routes : Routes = [
    {
        path: '', component: GitHubComponent
    }
];

export default RouterModule.forChild(routes)
