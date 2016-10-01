import {NgModule} from '@angular/core';
import {GitHubComponent} from "./github.component";
import gitHubRoutes from './github.routes';
import {AuthGuard} from "../app/auth-guard.service";

@NgModule({
    imports: [gitHubRoutes],
    declarations: [GitHubComponent]
})

export class GitHubModule {}
