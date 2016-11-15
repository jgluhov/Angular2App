import {NgModule} from '@angular/core';
import {WikipediaComponent} from './wikipedia.component';
import {CommonModule} from '@angular/common';
import wikipediaRoutes from './wikipedia.routes';
import {WikipediaSearchService} from './wikipedia-search.service';
import {JsonpModule} from '@angular/http';
import {HighlightDirective} from '../../common/highlight.directive';

@NgModule({
  imports: [CommonModule, wikipediaRoutes, JsonpModule],
  declarations: [WikipediaComponent, HighlightDirective],
  providers: [WikipediaSearchService]
})

export class WikipediaModule {}
