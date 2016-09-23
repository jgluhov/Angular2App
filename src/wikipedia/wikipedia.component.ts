import {Component} from '@angular/core';
import {WikipediaSearchService} from "./wikipedia-search.service";
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
    templateUrl: './wikipedia.component.html'
})

export class WikipediaComponent {
    items: Array<string>;
    term$ = new Subject<string>();

    constructor(private service: WikipediaSearchService) {
        this.term$
            .debounceTime(400)
            .distinctUntilChanged()
            .subscribe(term => this.search(term));
    };

    search(term: string) {
        this.service.search(term).subscribe(results => this.items = results);
    }
}
