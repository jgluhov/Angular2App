import {NgModule} from '@angular/core';
import {GitHubComponent} from "./github.component";
import gitHubRoutes from './github.routes';

@NgModule({
    imports: [gitHubRoutes],
    declarations: [GitHubComponent]
})

export class GitHubModule {}
