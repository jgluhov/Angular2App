import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Input
} from '@angular/core';

import {Observable} from 'rxjs';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/bufferCount';

@Component({
  selector: 'infinite-table',
  template: `
    <div #phoneBook>
      <ul class="list-unstyled" #list></ul>
    </div>`,
  styles: [`
    :host > ul {        
        height: 300px;
    }
  `]
})

export class InfiniteTableComponent implements AfterViewInit {
  @Input('data') data: Array<string>;
  @ViewChild('phoneBook') phoneBook: ElementRef;

  totalResults: number = 10000;
  rowHeight: number = 30;
  yPosition$: Observable<number>;
  windowHeight$: Observable<number>;

  ngAfterViewInit() {
    this.yPosition$ = Observable.fromEvent(window, 'scroll')
      .map(() => this.phoneBook.nativeElement.scrollY);

    this.windowHeight$ = Observable.fromEvent(window, 'resize')
      .debounceTime(50)
      .map(() => this.phoneBook.nativeElement.clientHeight);

    const firstVisibleRow$ = this.yPosition$
      .map(position => Math.floor(position / this.rowHeight))
      .distinctUntilChanged()
      .startWith(0);

    const screenHeight$ = Observable.of(this.phoneBook.nativeElement.clientHeight);
    const rowCount$ = screenHeight$
      .map(screenHeight => Math.ceil(screenHeight / this.rowHeight))
      .distinctUntilChanged();

    const visibleRowIndices$ = Observable.combineLatest(
      firstVisibleRow$, rowCount$, (firstRow, rowCount) => {
        const visibleIndices: any = [];

        const lastRow = firstRow + rowCount + 1;

        if (lastRow > this.totalResults) {
          firstRow -= lastRow - this.totalResults;
        }

        for (let i = 0; i <= rowCount; i++) {
          visibleIndices.push(i + firstRow);
        }

        return visibleIndices;
      });


    const removedIndices$ = visibleRowIndices$
      .bufferCount(2, 1)
      .map(buffer => _.difference(_.first(buffer), _.last(buffer)))
      .filter(difference => !_.isEmpty(difference));

    const addedIndices$ = visibleRowIndices$
      .bufferCount(2, 1)
      .map(buffer => _.difference(_.last(buffer), _.first(buffer)))
      .filter(difference => !_.isEmpty(difference));

    let rows = {};

    const renderRow = (index: number) => {
      const row = document.createElement('li');
      row.innerText = index.toString();
      row.style.top = index * this.rowHeight + 'px';
      this.phoneBook.nativeElement.appendChild(row);
      rows[index] = row;
    };

    const removeRow = (index: number) => {
      if (!index) {
        return;
      }

      rows[index].parentElement.removeChild(rows[index]);
      rows[index] = null;
    };

    addedIndices$.subscribe(added => {
      return _.map(added, renderRow);
    });

    removedIndices$.subscribe(removed => {
      return _.map(removed, removeRow);
    });

    const init = () => {
      const added: Array<number> = [];
      for(let i = 0; i < 10; i++) {
        added.push(i);
      }
      _.map(added, renderRow);
    };

    init();

  }
}
