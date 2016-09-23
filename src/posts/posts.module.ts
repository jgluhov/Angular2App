import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {PostsComponent} from "./posts.component";
import ContactsRoutes from './posts.routes'
import {PostComponent} from "./post.component";
import {HttpModule} from "@angular/http";
import {PostsService} from "./posts.service";

@NgModule({
    imports: [CommonModule, ContactsRoutes, HttpModule],
    declarations: [PostsComponent, PostComponent],
    providers: [PostsService]
})

export class PostsModule {}