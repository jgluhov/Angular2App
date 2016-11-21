import {
  Component,
  ViewChild,
  ElementRef,
  Input,
  OnInit
} from '@angular/core';

import {
  Observable,
  ReplaySubject
} from 'rxjs';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/bufferCount';

@Component({
  selector: 'infinite-table',
  templateUrl: './infinite-table.component.html',
  styleUrls: ['./infinite-table.component.styl']
})

export class InfiniteTableComponent implements OnInit {
  @Input('data') data: Array<string>;

  @Input('infiniteTableHeight')
  set infiniteTableHeight(value: number) {
      this.contentHeight = value || 380;
  }

  @ViewChild('headerRef') headerRef: ElementRef;
  @ViewChild('contentRef') contentRef: ElementRef;
  @ViewChild('bodyRef') bodyRef: ElementRef;

  initScrollSubject$: ReplaySubject<number>;
  visibleData$: Observable<Array<Object>>;

  contentHeight: number;

  get totalHeight() {
    return this.rowHeight * this.dataCount;
  }

  get visibleRowsCount() {
    return Math.ceil(this.contentHeight / this.rowHeight);
  }

  get rowHeight(): number {
    return 38;
  }

  get dataCount() {
    return this.data.length;
  }

  getContentScrollPosition(): number {
    return this.contentRef.nativeElement.scrollTop;
  }

  initialize() {
    this.initScrollSubject$ = new ReplaySubject<number>(1);
    this.initScrollSubject$.next(this.getContentScrollPosition());
  }

  get contentScrollPosition$(): Observable<number> {
    return Observable.fromEvent(this.contentRef.nativeElement, 'scroll')
      .map(this.getContentScrollPosition.bind(this)) as Observable<number>;
  }

  get scrollPosition$(): Observable<number> {
    return this.initScrollSubject$.merge(this.contentScrollPosition$);
  }

  get firstVisibleRow$(): Observable<number> {
    return this.scrollPosition$
      .map(position => Math.floor(position / this.rowHeight));
  }

  get rowCount$() {
    return Observable.of(this.visibleRowsCount)
      .map((visibleRowsCount: number) => {
        return visibleRowsCount > this.dataCount ?
          this.dataCount : visibleRowsCount;
      });
  }

  get visibleIndices$() {
    return Observable.combineLatest(
      this.firstVisibleRow$, this.rowCount$,
      (firstVisibleRow, rowCount) => {

        let indices: Array<number> = [];

        const lastVisibleRow = firstVisibleRow + rowCount;

        if (lastVisibleRow >= this.dataCount) {
          firstVisibleRow -= lastVisibleRow - this.dataCount;
        }

        for (let i = 0; i < rowCount; i++) {
          indices.push(i + firstVisibleRow);
        }

        return indices;
      }
    );
  }

  rowPositionCount(index: number) {
    return index * this.rowHeight;
  }

  ngOnInit() {
    this.initialize();

    this.visibleData$ = this.visibleIndices$
      .map((indices: Array<number>) => indices.map((index) => this.data[index]));
  }
}
