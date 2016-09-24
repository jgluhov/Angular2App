import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {PostsComponent} from "./posts.component";
import ContactsRoutes from './posts.routes'
import {PostDetailComponent} from "./post-detail.component";
import {HttpModule} from "@angular/http";
import {PostsService} from "./posts.service";

@NgModule({
    imports: [CommonModule, ContactsRoutes, HttpModule],
    declarations: [PostsComponent, PostDetailComponent],
    providers: [PostsService]
})

export class PostsModule {}