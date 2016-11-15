import {Injectable} from '@angular/core';
import {Jsonp, URLSearchParams} from '@angular/http';

import {Observable} from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';

@Injectable()
export class WikipediaSearchService {
  hostUrl: string = 'http://en.wikipedia.org/w/api.php';

  constructor(private jsonp: Jsonp) {
  }

  search(terms$: Observable<string>): Observable<Array<Object>> {
    return terms$
      .debounceTime(400)
      .switchMap(term => this._search(term));
  }

  private _search(term: string) {
    let params = new URLSearchParams();

    params.set('action', 'opensearch');
    params.set('search', term);
    params.set('format', 'json');
    params.set('callback', 'JSONP_CALLBACK');

    return this.jsonp.get(this.hostUrl, {search: params})
      .map(res => <string[]> res.json()[1]);
  }
}
