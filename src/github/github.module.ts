import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GitHubComponent} from "./github.component";
import gitHubRoutes from './github.routes';
import {GitHubService} from "./github.service";

@NgModule({
    imports: [CommonModule, gitHubRoutes],
    declarations: [GitHubComponent],
    providers: [GitHubService]
})

export class GitHubModule {}
