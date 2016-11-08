import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnInit
} from '@angular/core';

import {
  Observable,
  Scheduler
} from 'rxjs';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/scan';


@Component({
  templateUrl: './breakout.component.html',
  styleUrls: ['./breakout.component.styl']
})

export class BreakoutComponent implements AfterViewInit, OnInit {
  context: CanvasRenderingContext2D;
  PADDLE_SPEED = 240;
  TICKER_INTERVAL = 17;
  PADDLE_WIDTH = 100;
  PADDLE_HEIGHT = 20;

  @ViewChild('breakoutArea') breakoutArea: ElementRef;

  ngAfterViewInit() {
    this.context = this.breakoutArea.nativeElement.getContext('2d');
    this.context.fillStyle = 'pink';
  }

  get ticker$() {
    return Observable.interval(this.TICKER_INTERVAL, (Scheduler as any).requestAnimationFrame)
      .map(() => ({
        time: Date.now(),
        delta: null
      }))
      .scan(
        (previous, current) => ({
          time: current.time,
          delta: (current.time - previous.time) / 1000
        })
      );
  }

  ngOnInit() {
    this.input$.subscribe(x => console.log(x));
    this.ticker$.subscribe(x => console.log(x));
  }

  get input$() {

    const PADDLE_KEYS = {
      left: 37,
      right: 39
    };

    const keydownSandbox = (e: KeyboardEvent) => {
      switch (e.keyCode) {
        case PADDLE_KEYS.left:
          return -1;
        case PADDLE_KEYS.right:
          return 1;
        default:
          return 0;
      }
    };

    const keyupSandbox = (e: KeyboardEvent) => 0;

    const keydown$ = Observable.fromEvent(document, 'keydown', keydownSandbox);
    const keyup$ = Observable.fromEvent(document, 'keyup', keyupSandbox);

    return Observable.merge(keydown$, keyup$)
      .distinctUntilChanged();
  }

  get paddle$() {
    return this.ticker$.withLatestFrom(this.input$)
      .scan(
        (position, [ticker, direction]) => {
          const next = position + direction * ticker.delta * this.PADDLE_SPEED;
          return Math.max(
            Math.min(next, this.breakoutArea.nativeElement.width - this.PADDLE_WIDTH / 2),
            this.PADDLE_WIDTH / 2
          );
        },
        this.breakoutArea.nativeElement.width / 2
      )
      .distinctUntilChanged();
  }
}
