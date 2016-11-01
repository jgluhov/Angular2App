import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnInit,
  OnDestroy,
  Renderer
} from '@angular/core';

import {SpaceshipGameContextService} from './spaceship-game-context.service';
import {
  GameActors,
  Star,
  Enemy,
  Shot,
  Spaceship,
  ShotEvent
} from './spaceship-game.interface';

import {
  Observable,
  Scheduler,
  BehaviorSubject,
  Subject
} from 'rxjs';

import 'rxjs/add/observable/range';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toArray';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/generate';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/sampleTime';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/publish';
import 'rxjs/observable/from';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/withLatestFrom';

const bulletAudioUrl = require('../../assets/audio/bullet.mp3');

@Component({
  selector: 'spaceship-game',
  templateUrl: './spaceship-game.component.html',
  styleUrls: ['./spaceship-game.component.styl']
})

export class SpaceshipGameComponent implements AfterViewInit, OnInit, OnDestroy {

  scoreSubject$: BehaviorSubject<number>;
  healthSubject$: BehaviorSubject<number>;
  firePlayerSubject$: Subject<ShotEvent>;
  firePlayerElement: HTMLAudioElement;
  gameOver$: Subject<any>;
  enemies$: Subject<Array<Enemy>>;
  spaceship$: Subject<Spaceship>;
  HERO_HEALTH: number = 100;
  STAR_NUMBER: number = 250;
  ENEMY_FREQ: number = 1500;
  ENEMY_SPACESHIP_WIDTH: number = 40;
  ENEMY_SHOOTING_FREQ: number = 750;
  SHOOTING_SPEED = 5;
  ENEMY_SHOOTING_SPEED = 5;
  SCORE_INCREASE = 10;
  HEALTH_DECREASE = 5;
  ENEMY_SPEED = 1;
  HERO_Y: number;

  @ViewChild('spaceshipArea') spaceshipArea: ElementRef;

  constructor(
    private spaceshipGameContextService: SpaceshipGameContextService,
    private render: Renderer
  ) {}

  ngOnInit() {
    this.HERO_Y = this.spaceshipArea.nativeElement.clientHeight - 30;
    this.gameOver$ = new Subject<any>();
  }

  ngOnDestroy() {
    this.stopGame();
  }

  static createAudioElement(): HTMLAudioElement {
    const audioElement = document.createElement('audio');
    const sourceElement = document.createElement('source');

    sourceElement.src = bulletAudioUrl;
    sourceElement.type = 'audio/mpeg; codecs="mp3"';

    audioElement.appendChild(sourceElement);

    return audioElement;
  }

  ngAfterViewInit() {
    this.spaceshipGameContextService.context = this.spaceshipArea.nativeElement.getContext('2d');
    this.spaceshipGameContextService.contextAreaRef = this.spaceshipArea;
    this.spaceshipGameContextService.renderWelcomeScreen();
  }

  startGame() {
    this.scoreSubject$ = new BehaviorSubject(0);
    this.healthSubject$ = new BehaviorSubject(0);

    this.enemies$ = new Subject<Array<Enemy>>();
    this.enemiesObservable$.subscribe(this.enemies$);

    this.firePlayerElement = SpaceshipGameComponent.createAudioElement();
    this.firePlayerSubject$ = new Subject<ShotEvent>();

    this.spaceship$ = new Subject<Spaceship>();
    this.spaceshipObservable$.subscribe(this.spaceship$);

    this.render.setElementClass(this.spaceshipArea.nativeElement, 'active', true);
    this.game$.subscribe((actors: GameActors) => this.spaceshipGameContextService.renderScene(actors));
  }

  stopGame() {
    this.gameOver$.next();
    this.gameOver$.complete();
  }

  get game$() {
    return Observable.combineLatest(
      this.starStream$,
      this.spaceship$,
      this.enemies$,
      this.playerShots$,
      this.score$,
      this.health$,
      this.firePlayer$,
      (stars, spaceship, enemies, playerShots, score, health) => {
        return {
          stars: stars,
          spaceship: spaceship,
          enemies: enemies,
          playerShots: playerShots,
          score: score,
          health: health,
        };
      })
      .takeUntil(this.gameOver$);
  }

  get starStream$() {
    const starsObservable$ = Observable.range(1, this.STAR_NUMBER)
      .map(() => {
        return {
          x: _.random(0, this.spaceshipArea.nativeElement.width),
          y: _.random(0, this.spaceshipArea.nativeElement.height),
          size: _.random(0, 3)
        };
      })
      .toArray();

    const starsAnimationHandler = (stars: Array<Star>) => {
      _.forEach(stars, (star: Star) => {
        _.gt(star.y, this.spaceshipArea.nativeElement.height) ?
          star.y = 0 : star.y += 0.1;
      });

      return stars;
    };

    return Observable.combineLatest(
      starsObservable$, SpaceshipGameComponent.animation(),
      (stars: Array<Star>) => starsAnimationHandler(stars)
    );
  }

  get spaceshipObservable$() {

    const positionObservable$ = Observable.fromEvent(
      this.spaceshipArea.nativeElement, 'mousemove')
      .map((event: MouseEvent) => {
        return {
          x: event.offsetX,
          y: this.HERO_Y
        };
      })
      .startWith({
        x: this.spaceshipArea.nativeElement.width / 2,
        y: this.HERO_Y
      });

    const spaceshipObservable$ = Observable.combineLatest(
      this.healthSubject$, positionObservable$,
      (health, position) => {
        return {
          health: health,
          position: position
        };
      });

    const touchHandler = (spaceship: Spaceship, enemy: Enemy) => {
      const isDead = !enemy.isDead && (SpaceshipGameComponent.collisionSpaceship(spaceship, enemy));

      if (isDead) {
        enemy.isDead = true;
        this.scoreSubject$.next(this.SCORE_INCREASE);
        this.healthSubject$.next(this.HEALTH_DECREASE);
      }
    };

    const hitHandler = (spaceship: Spaceship, enemy: Enemy) => {
      _.forEach(enemy.shots, (shot: Shot) => {

        const isActive = shot.isActive && SpaceshipGameComponent.collisionSpaceship(spaceship, shot);

        if (isActive) {
          shot.isActive = false;
          this.healthSubject$.next(this.HEALTH_DECREASE);
        }
      });
    };

    const spaceshipHandler = (spaceship: Spaceship, enemies: Array<Enemy>) => {
      _.forEach(enemies, (enemy: Enemy) => {
        touchHandler(spaceship, enemy);
        hitHandler(spaceship, enemy);
      });

      return spaceship;
    };

    return Observable.combineLatest(spaceshipObservable$, this.enemies$, spaceshipHandler)
      .takeUntil(this.gameOver$);
  }

  get enemiesObservable$() {

    const isVisible = (target: Shot | Enemy): boolean => {
      return target.x > -this.ENEMY_SPACESHIP_WIDTH &&
        target.x < this.spaceshipArea.nativeElement.width + this.ENEMY_SPACESHIP_WIDTH &&
        target.y > -this.ENEMY_SPACESHIP_WIDTH &&
        target.y < this.spaceshipArea.nativeElement.height + this.ENEMY_SPACESHIP_WIDTH;
    };

    const isAlive = (enemy: Enemy): boolean => !enemy.isDead;
    const isActive = (shot: Shot): boolean => shot.isActive;

    const enemiesObservable$ = Observable.interval(this.ENEMY_FREQ)
      .scan(
        (enemyArray: Array<Enemy>) => {
          let enemy: Enemy = {
            x: _.random(0, this.spaceshipArea.nativeElement.width),
            y: 0,
            shots: [],
            isDead: false
          };

          Observable.interval(this.ENEMY_SHOOTING_FREQ)
            .takeUntil(this.gameOver$)
            .subscribe(() => {
              if (!enemy.isDead) {
                enemy.shots.push({
                  x: enemy.x,
                  y: enemy.y,
                  isActive: true
                });
              }
            });

          enemyArray.push(enemy);

          return enemyArray;
        },
        []
      )
      .map((enemyArray: Array<Enemy>) => _.filter(enemyArray, isVisible))
      .map((enemyArray: Array<Enemy>) => _.filter(enemyArray, isAlive));

    const enemiesAnimationHandler = (enemies: Array<Enemy>) => {
      _.forEach(enemies, (enemy: Enemy) => {
        enemy.x += _.random(-5, 5);
        enemy.y += this.ENEMY_SPEED;

        enemy.shots = _.chain(enemy.shots).filter(isVisible).filter(isActive).value();

        _.forEach(enemy.shots, (shot: Shot) => shot.y += this.ENEMY_SHOOTING_SPEED);
      });

      return enemies;
    };

    return Observable.combineLatest(
      enemiesObservable$, SpaceshipGameComponent.animation(),
      (enemies: Array<Enemy>) => enemiesAnimationHandler(enemies)
    )
      .takeUntil(this.gameOver$);
  }

  get playerShots$(): Observable<Array<Shot>> {

    const isVisible = (shot: Shot): boolean => shot.y > 0;

    const shotsEventObservable$ = Observable.merge(
      Observable.fromEvent(this.spaceshipArea.nativeElement, 'click'),
      Observable.fromEvent(document, 'keydown')
        .filter((e: KeyboardEvent) => e.keyCode === 32)
    )
      .startWith({})
      .sampleTime(200)
      .timestamp()
      .do(() => this.firePlayerSubject$.next());

    const shotsObservable$ = Observable.combineLatest(
      shotsEventObservable$, this.spaceship$,
      (shotEvent: ShotEvent, spaceship: Spaceship) => {
        return {
          timestamp: shotEvent.timestamp,
          x: spaceship.position.x,
          isActive: true
        };
      })
      .distinctUntilChanged(null, (shot: Shot) => shot.timestamp)
      .scan(
        (shotArray: Array<Shot>, shot: Shot) => {
          shotArray.push({
            x: shot.x,
            y: this.HERO_Y,
            isActive: true
          });

          return shotArray;
        },
        []
      );

    return Observable.combineLatest(
      shotsObservable$, this.enemies$, SpaceshipGameComponent.animation(),
      (shotArray: Array<Shot>, enemyArray: Array<Enemy>) => {
        shotArray = _.filter(shotArray, isVisible);

        _.forEach(shotArray, (shot: Shot) => {
          _.forEach(enemyArray, (enemy: Enemy) => {
            const isDead = !enemy.isDead && SpaceshipGameComponent.collisionShot(shot, enemy);

            if (isDead) {
              this.scoreSubject$.next(this.SCORE_INCREASE);
              enemy.isDead = isDead;
            }
          });

          shot.y -= this.SHOOTING_SPEED;
        });

        return shotArray;
      });
  }

  get score$() {
    return this.scoreSubject$
      .scan((previousScore: number, currentScore: number) => previousScore + currentScore, 0);
  }

  get health$() {
    return this.healthSubject$
      .scan((currentHealth: number, decreaseValue: number) => currentHealth - decreaseValue, this.HERO_HEALTH);
  }

  get firePlayer$() {
    const play = ((elem: HTMLAudioElement) => elem.play()).bind(this, this.firePlayerElement);
    const stop = ((elem: HTMLAudioElement) => {
      elem.pause();
      elem.currentTime = 0;
    }).bind(this, this.firePlayerElement);

    const isPlayed = ((elem: HTMLAudioElement) => elem.ended).bind(this, this.firePlayerElement);

    const fireHandler = () => isPlayed() ? play() : (() => {
      stop();
      play();
    })();

    return this.firePlayerSubject$.do(() => fireHandler());
  }

  static animation() {
    return Observable.generate(0, (x) => true, (x) => x + 1, (x) => x, Scheduler.animationFrame);
  }

  static collisionSpaceship(spaceship: Spaceship, target: Enemy | Shot) {
    return (spaceship.position.x > target.x - 20 && spaceship.position.x < target.x + 20) &&
      (spaceship.position.y > target.y - 20 && spaceship.position.y < target.y + 20);
  }

  static collisionShot(shot: Shot, enemy: Enemy): Boolean {
    return (shot.x > enemy.x - 20 && shot.x < enemy.x + 20) &&
      (shot.y > enemy.y - 20 && shot.y < enemy.y + 20);
  }
}
