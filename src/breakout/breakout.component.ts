import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit
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

type TICK = {
  time: number,
  delta: number
}
type PADDLE_DIRECTION = number;
type PADDLE_POSITION = number;

@Component({
  templateUrl: './breakout.component.html',
  styleUrls: ['./breakout.component.styl']
})

export class BreakoutComponent implements AfterViewInit {
  context: CanvasRenderingContext2D;
  PADDLE_SPEED = 240;
  TICKER_INTERVAL = 17;
  PADDLE_WIDTH = 100;
  PADDLE_HEIGHT = 20;
  BALL_SPEED = 60;

  @ViewChild('breakoutArea') breakoutArea: ElementRef;

  ngAfterViewInit() {
    this.breakoutArea.nativeElement.width = this.breakoutArea.nativeElement.clientWidth;
    this.breakoutArea.nativeElement.height = this.breakoutArea.nativeElement.clientHeight;

    this.context = this.breakoutArea.nativeElement.getContext('2d');

    this.context.fillStyle = 'pink';

    // this.paddle$.subscribe(x => console.log(x));
    // this.ticker$.subscribe(x => console.log(x));
    // this.input$.subscribe(x => console.log(x));
    this.drawTitle();
    this.drawControls();
    this.drawAuthor();
    this.paddle$.subscribe(x => console.log(x));
  }

  get ticker$(): Observable<TICK> {

    const tick = () => ({ time: Date.now(), delta: 0 });

    return Observable.interval(this.TICKER_INTERVAL, (Scheduler as any).requestAnimationFrame)
      .map(tick)
      .scan(
        (previous: TICK, current: TICK) => ({
          time: current.time,
          delta: (current.time - previous.time) / 1000
        })
      );
  }

  get input$(): Observable<PADDLE_DIRECTION> {
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

  get paddle$(): Observable<PADDLE_POSITION> {
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

  // factory() {
  //
  // }

  // collision(brick, ball) {
  //   return ball.position.x + ball.direction.x > brick.x - brick.width / 2
  //     && ball.position.x + ball.direction.x < brick.x + brick.width / 2
  //     && ball.position.y + ball.direction.y > brick.y - brick.height / 2
  //     && ball.position.y + ball.direction.y < brick.y + brick.height / 2;
  // }
  //
  // get objects$() {
  //   const initialObjects = {
  //     ball: {
  //       position: {
  //         x: this.breakoutArea.nativeElement.width / 2,
  //         y: this.breakoutArea.nativeElement.height / 2
  //       },
  //       direction: {
  //         x: 2,
  //         y: 2
  //       }
  //     },
  //     bricks: this.factory(),
  //     score: 0
  //   };
  //
  //   return this.ticker$.withLatestFrom(this.paddle$)
  //     .scan(({ball, bricks, collisions}, [ticker, paddle]) => {
  //
  //       const survivors = [];
  //
  //       collisions = {
  //         paddle: false,
  //         floor: false,
  //         wall: false,
  //         ceiling: false,
  //         brick: false
  //       };
  //
  //       ball.position.x = ball.position.x + ball.direction.x * ticker.delta * this.BALL_SPEED;
  //       ball.position.y = ball.position.y + ball.direction.y * ticker.delta * this.BALL_SPEED;
  //
  //       bricks.forEach(brick => {
  //         if(!collision(brick, ball)) {
  //           survivors.push(brick);
  //         } else {
  //           collisions.brick = true;
  //           score = score + 10;
  //         }
  //       })
  //
  //     }, initialObjects);
  // }

  drawTitle() {
    this.context.textAlign = 'center';
    this.context.font = '24px Courier New';
    this.context.fillText(
      'rxjs breakout',
      this.breakoutArea.nativeElement.width / 2,
      this.breakoutArea.nativeElement.height / 2 - 24
    );
  }

  drawControls() {
    this.context.textAlign = 'center';
    this.context.font = '16px Courier New';
    this.context.fillText(
      'press [<] and [>] to play',
      this.breakoutArea.nativeElement.width / 2,
      this.breakoutArea.nativeElement.height / 2
    );
  }

  drawAuthor() {
    this.context.textAlign = 'center';
    this.context.font = '16px Courier New';
    this.context.fillText(
      'by JGluhov',
      this.breakoutArea.nativeElement.width / 2,
      this.breakoutArea.nativeElement.height / 2 + 24
    );
  }
}
