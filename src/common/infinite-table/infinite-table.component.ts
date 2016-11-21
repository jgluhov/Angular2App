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
  template: `
    <div class="infinite-table-header" #headerRef>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th># Index</th>
            <th># Value 0</th>
            <th># Value 1</th>
            <th># Value 2</th>
            <th># Value 3</th>
            <th># Value 4</th>
            <th># Value 5</th>
            <th># Value 6</th>
            <th># Value 7</th>
            <th># Value 8</th>
            <th># Value 9</th>
            <th># Value 10</th>
          </tr>
        </thead>
      </table>     
    </div>
    
    <div class="infinite-table-content" #contentRef>
      <table class="table table-bordered" [style.height.px]="totalHeight" #bodyRef>        
        <tbody>
          <tr *ngFor="let item of (visibleData$ | async)" [style.top.px]="item.index * 38">
            <td>{{item.index + 1}}</td>
            <td>{{item.value}}</td>
            <td>{{item.value}}</td>
            <td>{{item.value}}</td>
            <td>{{item.value}}</td>
            <td>{{item.value}}</td>
            <td>{{item.value}}</td>
            <td>{{item.value}}</td>
            <td>{{item.value}}</td>
            <td>{{item.value}}</td>
            <td>{{item.value}}</td>
          </tr>         
        </tbody>
      </table>
    </div>
`,
  styleUrls: ['./infinite-table.component.styl']
})

export class InfiniteTableComponent implements OnInit {
  @Input('data') data: Array<string>;

  @ViewChild('headerRef') headerRef: ElementRef;
  @ViewChild('contentRef') contentRef: ElementRef;
  @ViewChild('bodyRef') bodyRef: ElementRef;

  totalRows: number;
  rowHeight: number = 38;

  yPosition$: Observable<number>;

  initScrollSubject$: ReplaySubject<number>;
  firstVisibleRow$: Observable<number>;
  rowCount$: Observable<number>;
  visibleIndices$: Observable<Array<number>>;
  visibleData$: Observable<Array<Object>>;

  get contentHeight() {
    return this.contentRef.nativeElement.clientHeight;
  }

  get totalHeight() {
    return this.rowHeight * this.totalRows;
  }

  get visibleRowsCount() {
    return Math.ceil(this.contentHeight / this.rowHeight);
  }

  get scrollPosition() {
    return this.contentRef.nativeElement.scrollTop;
  }

  initialize() {
    this.totalRows = this.data.length;
    this.initScrollSubject$ = new ReplaySubject<number>(1);
    this.initScrollSubject$.next(this.scrollPosition);
  }

  ngOnInit() {

    this.initialize();

    this.yPosition$ = this.initScrollSubject$.merge(
      Observable.fromEvent(this.contentRef.nativeElement, 'scroll')
        .map(() => this.scrollPosition)
    );

    this.firstVisibleRow$ = this.yPosition$
      .map(yPosition => Math.floor(yPosition / this.rowHeight));

    this.rowCount$ = Observable.of(this.visibleRowsCount);

    this.visibleIndices$ = Observable.combineLatest(
      this.firstVisibleRow$, this.rowCount$,
      (firstVisibleRow, rowCount) => {

        let indices: Array<number> = [];

        const lastVisibleRow = firstVisibleRow + rowCount + 1;

        if (lastVisibleRow > this.totalRows) {
          firstVisibleRow -= lastVisibleRow - this.totalRows;
        }

        for (let i = 0; i <= rowCount; i++) {
          indices.push(i + firstVisibleRow);
        }

        return indices;
      }
    );

    this.visibleData$ = this.visibleIndices$
      .map((indices: Array<number>) => indices.map((index) => ({
        index: index,
        value: this.data[index]
      })));
  }
}
