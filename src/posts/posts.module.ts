import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {PostsComponent} from "./posts.component";
import PostsRoutes from './posts.routes'
import {PostDetailComponent} from "./post-detail.component";
import {HttpModule} from "@angular/http";
import {PostsService} from "./posts.service";

@NgModule({
    imports: [CommonModule, PostsRoutes, HttpModule],
    declarations: [PostsComponent, PostDetailComponent],
    providers: [PostsService]
})

export class PostsModule {}