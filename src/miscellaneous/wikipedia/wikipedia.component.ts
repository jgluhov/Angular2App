import {Component, OnInit} from '@angular/core';
import {WikipediaSearchService} from './wikipedia-search.service';

import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/timestamp';
import 'rxjs/add/operator/map';

@Component({
  templateUrl: './wikipedia.component.html',
  styles: [`
    time {
      display: block;
      height: 30px;
    }
  `]
})

export class WikipediaComponent implements OnInit {
  time$: Subject<Object>;
  items$: Subject<Array<Object>>;
  term$ = new Subject<string>();

  dateOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  };

  constructor(private service: WikipediaSearchService) {};

  ngOnInit() {
    this.time$ = new Subject<Object>();
    this.items$ = new Subject<Array<Object>>();

    this.service.search(this.term$).subscribe(this.items$);

    this.term$.subscribe(() => this.time$.next({}));

    this.items$
      .timestamp()
      .map(item => Object.assign({}, item, {
        datetime: new Date(item.timestamp).toISOString(),
        date: this.toDateTimeFormat(item.timestamp)
      }))
      .subscribe(this.time$);
  }

  toDateTimeFormat(timestamp: number) {
    return new Intl.DateTimeFormat('en-US', this.dateOptions)
      .format(new Date(timestamp));
  }
}
