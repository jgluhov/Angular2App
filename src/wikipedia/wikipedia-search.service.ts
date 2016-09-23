import {Injectable} from '@angular/core';
import {Jsonp, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs";

@Injectable()
export class WikipediaSearchService {
    constructor(private jsonp: Jsonp) {
    }

    search(terms: Observable<string>) {
        return terms
            .debounceTime(400)
            .switchMap(term => this._search(term));
    }

    private _search(term: string) {
        let search = new URLSearchParams();
        search.set('action', 'opensearch');
        search.set('search', term);
        search.set('format', 'json');

        return this.jsonp.get('http://en.wikipedia.org/w/api.php?callback=JSONP_CALLBACK', {search})
            .map(res => res.json()[1]);
    }
}