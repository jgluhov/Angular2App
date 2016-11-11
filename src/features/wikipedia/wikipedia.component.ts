import {Component, OnInit} from '@angular/core';
import {WikipediaSearchService} from './wikipedia-search.service';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs';

@Component({
  templateUrl: './wikipedia.component.html'
})

export class WikipediaComponent implements OnInit {
  items$: Observable<Array<Object>>;
  term$ = new Subject<string>();

  constructor(private service: WikipediaSearchService) {
  };

  ngOnInit() {
    this.items$ = this.service.search(this.term$);
  }
}
