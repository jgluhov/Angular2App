import {Component} from '@angular/core';
import {WikipediaSearchService} from "./wikipedia-search.service";

import 'rxjs/add/operator/map';

@Component({
    templateUrl: './wikipedia.component.html'
})

export class WikipediaComponent {
    items: Array<string>;

    constructor(private service: WikipediaSearchService) {};

    search(term: string) {
        this.service.search(term).subscribe(results => this.items = results);
    }
}
