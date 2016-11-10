import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit, OnDestroy
} from '@angular/core';

import {
  Observable,
  Scheduler,
  Subject, Subscription
} from 'rxjs';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/sampleTime';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/do';

type TICK = {
  time: number,
  delta: number
};

type PADDLE_DIRECTION = number;

type PADDLE_POSITION = number;

type BRICK = {
  x: number,
  y: number,
  width: number,
  height: number
}

type BALL_POSITION = {
  x: number,
  y: number
}

type BALL_DIRECTION = {
  x: number,
  y: number
}

type BALL = {
  position: BALL_POSITION,
  direction: BALL_DIRECTION
}

type SCORE = number;

@Component({
  templateUrl: './breakout.component.html',
  styleUrls: ['./breakout.component.styl']
})

export class BreakoutComponent implements AfterViewInit, OnDestroy {
  context: CanvasRenderingContext2D;
  beeper$: Subject<number>;
  audioContext: any;

  beeperSub: Subscription;
  gameSub: Subscription;

  PADDLE_SPEED = 240;

  PADDLE_WIDTH = 100;
  PADDLE_HEIGHT = 20;
  BALL_SPEED = 60;

  BRICK_GAP = 3;
  BRICK_HEIGHT = 20;
  BRICK_COLUMNS = 7;
  BRICK_ROWS = 5;

  BALL_RADIUS = 10;

  @ViewChild('breakoutArea') breakoutArea: ElementRef;

  ngAfterViewInit() {
    this.breakoutArea.nativeElement.width = this.breakoutArea.nativeElement.clientWidth;
    this.breakoutArea.nativeElement.height = this.breakoutArea.nativeElement.clientHeight;

    this.context = this.breakoutArea.nativeElement.getContext('2d');

    this.context.fillStyle = 'pink';

    this.drawTitle();
    this.drawControls();
    this.drawAuthor();

    this.beeper$ = new Subject<number>();
    this.audioContext = new AudioContext();

    this.beeperSub = this.initAudio(this.beeper$);

    this.gameSub = this.game$.subscribe(this.update.bind(this));
  }

  ngOnDestroy() {
    this.audioContext.close();
    this.beeperSub.unsubscribe();
    this.gameSub.unsubscribe();
  }

  get ticker$(): Observable<TICK> {

    const tick = () => ({time: Date.now(), delta: 0});

    return Observable.generate(0, (x) => true, (x) => x + 1, (x) => x, Scheduler.animationFrame)
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

  factory() {
    const countGap = () => this.BRICK_GAP + this.BRICK_GAP * this.BRICK_COLUMNS;
    let bricks: BRICK[] = [];

    const width = (this.breakoutArea.nativeElement.width - countGap()) / this.BRICK_COLUMNS;

    for (let i = 0; i < this.BRICK_ROWS; i++) {
      for (let j = 0; j < this.BRICK_COLUMNS; j++) {
        bricks.push({
          x: j * (width + this.BRICK_GAP) + width / 2 + this.BRICK_GAP,
          y: i * (this.BRICK_HEIGHT + this.BRICK_GAP) + this.BRICK_HEIGHT / 2 + this.BRICK_GAP + 20,
          width: width,
          height: this.BRICK_HEIGHT
        });
      }
    }

    return bricks;
  }

  initAudio(beeper$: Subject<number>): Subscription {
    return beeper$
      .sampleTime(100)
      .subscribe(
        (x) => {
          const oscillator = this.audioContext.createOscillator();

          oscillator.connect(this.audioContext.destination);
          oscillator.type = 'square';

          oscillator.frequency.value = Math.pow(2, (x - 49) / 12) * 440;

          oscillator.start();
          oscillator.stop(this.audioContext.currentTime + 0.100);
        });
  }

  collision(brick: BRICK, ball: BALL): boolean {
    return ball.position.x + ball.direction.x > brick.x - brick.width / 2
      && ball.position.x + ball.direction.x < brick.x + brick.width / 2
      && ball.position.y + ball.direction.y > brick.y - brick.height / 2
      && ball.position.y + ball.direction.y < brick.y + brick.height / 2;
  }

  hit(paddle: PADDLE_POSITION, ball: BALL): boolean {
    return ball.position.x > paddle - this.PADDLE_WIDTH / 2
      && ball.position.x < paddle + this.PADDLE_WIDTH / 2
      && ball.position.y > this.breakoutArea.nativeElement.height - this.PADDLE_HEIGHT - this.BALL_RADIUS / 2;
  }

  get objects$() {

    const initialObjects = {
      ball: {
        position: {
          x: this.breakoutArea.nativeElement.width / 2,
          y: this.breakoutArea.nativeElement.height / 2
        },
        direction: {
          x: 2,
          y: 2
        }
      },
      bricks: this.factory(),
      collisions: {
        paddle: false,
        floor: false,
        wall: false,
        ceiling: false,
        brick: false
      },
      score: 0
    };

    return this.ticker$.withLatestFrom(this.paddle$)
      .scan(
        ({ball, bricks, collisions, score}, [ticker, paddle]) => {

          const survivors: BRICK[] = [];

          collisions = {
            paddle: false,
            floor: false,
            wall: false,
            ceiling: false,
            brick: false
          };

          ball.position.x = ball.position.x + ball.direction.x * ticker.delta * this.BALL_SPEED;
          ball.position.y = ball.position.y + ball.direction.y * ticker.delta * this.BALL_SPEED;

          bricks.forEach((brick: BRICK) => {
            if (!this.collision(brick, ball)) {
              survivors.push(brick);
            } else {
              collisions.brick = true;
              score = score + 10;
            }
          });

          collisions.paddle = this.hit(paddle, ball);

          if (ball.position.x < this.BALL_RADIUS ||
            ball.position.x > this.breakoutArea.nativeElement.width - this.BALL_RADIUS) {
            ball.direction.x = -ball.direction.x;
            collisions.wall = true;
          }

          collisions.ceiling = ball.position.y < this.BALL_RADIUS;

          if (collisions.brick || collisions.paddle || collisions.ceiling) {
            ball.direction.y = -ball.direction.y;
          }

          return {
            ball: ball,
            bricks: survivors,
            collisions: collisions,
            score: score
          };
        },
        initialObjects
      );
  }

  update([, paddle, objects]) {
    this.context.clearRect(0, 0, this.breakoutArea.nativeElement.width, this.breakoutArea.nativeElement.height);

    this.drawPaddle(paddle);
    this.drawBall(objects.ball);
    this.drawBricks(objects.bricks);
    this.drawScore(objects.score);

    if (objects.ball.position.y > this.breakoutArea.nativeElement.height - this.BALL_RADIUS) {
      this.beeper$.next(28);
      this.drawGameOver('GAME OVER');
      this.dispose();
    }

    if (!objects.bricks.length) {
      this.beeper$.next(52);
      this.drawGameOver('CONGRATULATIONS');
      this.dispose();
    }

    if (objects.collisions.paddle) {
      this.beeper$.next(40);
    }

    if (objects.collisions.wall || objects.collisions.ceiling) {
      this.beeper$.next(45);
    }

    if (objects.collisions.brick) {
      this.beeper$.next(47 + Math.floor(objects.ball.position.y % 12));
    }

  }

  get game$() {
    return Observable.combineLatest(this.ticker$, this.paddle$, this.objects$);
  }

  dispose() {
    this.gameSub.unsubscribe();
  }

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

  drawPaddle(position: PADDLE_POSITION) {
    this.context.beginPath();
    this.context.rect(
      position - this.PADDLE_WIDTH / 2,
      this.context.canvas.height - this.PADDLE_HEIGHT,
      this.PADDLE_WIDTH,
      this.PADDLE_HEIGHT
    );
    this.context.fill();
    this.context.closePath();
  }

  drawBall(ball: BALL) {
    this.context.beginPath();
    this.context.arc(ball.position.x, ball.position.y, this.BALL_RADIUS, 0, 2 * Math.PI);
    this.context.fill();
    this.context.closePath();
  }

  drawBricks(bricks: BRICK[]) {
    bricks.forEach((brick: BRICK) => this.drawBrick(brick));
  }

  drawBrick(brick: BRICK) {
    this.context.beginPath();
    this.context.rect(
      brick.x - brick.width / 2,
      brick.y - brick.height / 2,
      brick.width,
      brick.height
    );
    this.context.fill();
    this.context.closePath();
  }

  drawScore(score: SCORE) {
    this.context.textAlign = 'left';
    this.context.font = '16px Courier New';
    this.context.fillText(score.toString(), this.BRICK_GAP, 16);
  }

  drawGameOver(text: string) {
    this.context.clearRect(
      this.breakoutArea.nativeElement.width / 4,
      this.breakoutArea.nativeElement.height / 3,
      this.breakoutArea.nativeElement.width / 2,
      this.breakoutArea.nativeElement.height / 3
    );
    this.context.textAlign = 'center';
    this.context.font = '24px Courier New';
    this.context.fillText(text, this.breakoutArea.nativeElement.width / 2, this.breakoutArea.nativeElement.height / 2);
  }
}
