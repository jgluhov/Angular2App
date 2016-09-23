import {NgModule} from "@angular/core";
import {WikipediaComponent} from "./wikipedia.component";
import {CommonModule} from "@angular/common";
import wikipediaRoutes from './wikipedia.routes';

@NgModule({
    imports: [CommonModule, wikipediaRoutes],
    declarations: [WikipediaComponent]
})

export class WikipediaModule {}