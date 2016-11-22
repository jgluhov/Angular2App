import {
  Component,
  Input,
  OnInit, OnDestroy
} from '@angular/core';

import {
  Observable,
  ReplaySubject, Subscription
} from 'rxjs';

type CONFIGURATION = {
  data: Array<Object>,
  columns: Array<Object>
  height: number
}

@Component({
  selector: 'infinite-table',
  templateUrl: './infinite-table.component.html',
  styleUrls: ['./infinite-table.component.styl']
})

export class InfiniteTableComponent implements OnInit, OnDestroy {
  ROW_HEIGHT: number = 40;

  data:  Array<Object>;
  columns: Array<Object>;
  contentHeight: number;

  heightSub: Subscription;

  @Input('config') set config(value: CONFIGURATION) {
    this.data = value.data;
    this.contentHeight = value.height;
    this.columns = value.columns;
  };

  visibleData$: Observable<Array<Object>>;
  onScroll$: ReplaySubject<number>;
  totalHeight: number;

  constructor() {
    this.onScroll$ = new ReplaySubject<number>(1);
  }

  ngOnInit() {
    this.heightSub = this.heightStream.subscribe(height => this.totalHeight = height);

    this.visibleData$ = this.visibleIndices$
      .map((indices: any) => indices.map((index: any) => this.data[index]));
  }

  get heightStream() {
    return Observable.combineLatest(
      Observable.of(this.ROW_HEIGHT),
      Observable.of(this.data),
      (rowHeight, data) => {
        return rowHeight * data.length;
      });
  }

  get firstRow$(): Observable<number> {
    return this.onScroll$.withLatestFrom(Observable.of(this.ROW_HEIGHT),
      (position, rowHeight) => Math.floor(position / rowHeight));
  }

  get rowsQuantity$(): Observable<number> {
    return Observable.combineLatest(
      Observable.of(this.contentHeight),
      Observable.of(this.ROW_HEIGHT),
      Observable.of(this.data),
      (contentHeight, rowHeight, data) => {
        const count = Math.ceil(contentHeight / rowHeight);
        return count > data.length ? data.length : count;
      }
    );
  }

  get visibleIndices$() {
    return Observable.combineLatest(
      this.firstRow$,
      this.rowsQuantity$,
      Observable.of(this.data),
      (first, qty, data) => {

        let indices: Array<number> = [];

        const last = first + qty + 1;

        if (last >= data.length) {
          first -= last - data.length;
        }

        for (let i = 0; i <= qty; i++) {
          indices.push(i + first);
        }

        return indices;
      }
    );
  }

  positionHandler(index: number) {
    return index * this.ROW_HEIGHT;
  }

  ngOnDestroy() {
    this.heightSub.unsubscribe();
  }
}
