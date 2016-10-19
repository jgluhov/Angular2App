import {Component, ViewChild, ElementRef, AfterViewInit, OnInit} from "@angular/core";

import {SpaceshipGameContextService} from "./spaceship-game-context.service";
import {
    GameActors,
    Star,
    Enemy,
    Shot,
    Spaceship,
    ShotEvent
} from "./spaceship-game.interface";

import {Observable, Scheduler, BehaviorSubject, Subject} from "rxjs";
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
import 'rxjs/add/operator/withLatestFrom';


@Component({
    selector: 'spaceship-game',
    templateUrl: './spaceship-game.component.html',
    styleUrls: ['./spaceship-game.component.styl']
})

export class SpaceshipGameComponent implements AfterViewInit, OnInit {

    scoreSubject$: BehaviorSubject<Object>;
    enemies$: Subject<Array<Enemy>>;
    spaceship$: Subject<Spaceship>;

    STAR_NUMBER: number = 250;
    ENEMY_FREQ: number = 1500;
    ENEMY_COUNT: number = 1;
    ENEMY_SPACESHIP_WIDTH: number = 40;
    ENEMY_SHOOTING_FREQ: number = 750;
    SHOOTING_SPEED = 5;
    ENEMY_SHOOTING_SPEED = 5;
    SCORE_INCREASE = 10;
    SPACE_HEIGHT = 20;
    HERO_Y: number;

    @ViewChild("spaceshipArea") spaceshipArea: ElementRef;

    constructor(private spaceshipGameContextService: SpaceshipGameContextService) {
    }

    ngOnInit() {
        this.HERO_Y = this.spaceshipArea.nativeElement.clientHeight - 30;

        this.enemies$ = new Subject<Array<Enemy>>();
        this.enemiesObservable$.subscribe(this.enemies$);

        this.spaceship$ = new Subject<Spaceship>();
        this.spaceshipObservable$.subscribe(this.spaceship$);

        this.scoreSubject$ = new BehaviorSubject(0);
    }

    ngAfterViewInit() {
        this.spaceshipGameContextService.context = this.spaceshipArea.nativeElement.getContext('2d');
        this.spaceshipGameContextService.contextAreaRef = this.spaceshipArea;

        this.game$.subscribe((actors: GameActors) => this.spaceshipGameContextService.renderScene(actors));
    }

    get game$() {


        return Observable.combineLatest(
            this.starStream$, this.spaceship$, this.enemies$, this.playerShots$, this.score$,
            (stars, spaceship, enemies, playerShots, score) => {
                return {
                    stars: stars,
                    spaceship: spaceship,
                    enemies: enemies,
                    playerShots: playerShots,
                    score: score
                }
            });
        // .takeWhile((actors: GameActors) => {
        //     const isGameOver = this.gameOver(actors.spaceship, actors.enemies);
        //     if(isGameOver) {
        //         console.log('game over');
        //     }
        //     return !isGameOver;
        // })
    }

    // complete stream
    get starStream$() {
        const starsObservable$ = Observable.range(1, this.STAR_NUMBER)
            .map(() => {
                return {
                    x: _.random(0, this.spaceshipArea.nativeElement.width),
                    y: _.random(0, this.spaceshipArea.nativeElement.height),
                    size: _.random(0, 3)
                }
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

    // complete stream
    get spaceshipObservable$() {

        const positionObservable$ = Observable.fromEvent(this.spaceshipArea.nativeElement, 'mousemove')
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

        const healthObservable$ = Observable.of(100);

        const spaceshipObservable$ = Observable.combineLatest(
            healthObservable$, positionObservable$,
            (health, position) => {
               return {
                   health: health,
                   position: position
               }
            });

        const touchHandler = (spaceship:Spaceship, enemy: Enemy) => {
            const isDead = !enemy.isDead && (SpaceshipGameComponent.collisionSpaceship(spaceship, enemy));

            if(isDead) {
                enemy.isDead = true;
                this.scoreSubject$.next(this.SCORE_INCREASE);
            }
        };

        const hitHandler = (spaceship: Spaceship, enemy: Enemy) => {
            _.forEach(enemy.shots, (shot: Shot) => {
                const isActive = shot.isActive && SpaceshipGameComponent.collisionSpaceship(spaceship, shot);

                if(isActive) {
                    console.log('active');
                    shot.isActive = false;
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

        return Observable.combineLatest(spaceshipObservable$, this.enemies$, spaceshipHandler);
    }

    // complete stream
    get enemiesObservable$() {

        const isVisible = (target: Shot | Enemy): boolean => {
            return target.x > -this.ENEMY_SPACESHIP_WIDTH &&
                target.x < this.spaceshipArea.nativeElement.width + this.ENEMY_SPACESHIP_WIDTH &&
                target.y > -this.ENEMY_SPACESHIP_WIDTH &&
                target.y < this.spaceshipArea.nativeElement.height + this.ENEMY_SPACESHIP_WIDTH;
        };

        const isAlive = (enemy: Enemy): boolean => !(enemy.isDead && _.isEmpty(enemy.shots));
        const isActive = (shot: Shot): boolean => shot.isActive;
        
        const enemiesObservable$ = Observable.interval(this.ENEMY_FREQ)
            .scan((enemyArray: Array<Enemy>) => {
                let enemy: Enemy = {
                    x: _.random(0, this.spaceshipArea.nativeElement.width),
                    y: 0,
                    shots: [],
                    isDead: false
                };

                Observable.interval(this.ENEMY_SHOOTING_FREQ)
                    .subscribe(() => {
                        enemy.shots.push({
                            x: enemy.x,
                            y: enemy.y,
                            isActive: true
                        });
                    });

                enemyArray.push(enemy);

                return enemyArray;
            }, [])
            .map((enemyArray: Array<Enemy>) => _.filter(enemyArray, isVisible))
            .map((enemyArray: Array<Enemy>) => _.filter(enemyArray, isAlive));

        const enemiesAnimationHandler = (enemies: Array<Enemy>) => {
            _.forEach(enemies, (enemy: Enemy) => {
                enemy.x += _.random(-5, 5);
                enemy.y += 0.1;

                enemy.shots = _.chain(enemy.shots)
                    .filter(isActive)
                    .filter(isVisible)
                    .forEach((shot: Shot) => shot.y += this.ENEMY_SHOOTING_SPEED)
                    .value();
            });

            return enemies;
        };

        return Observable.combineLatest(
            enemiesObservable$, SpaceshipGameComponent.animation(),
            (enemies: Array<Enemy>) => enemiesAnimationHandler(enemies)
        )
    }

    // complete stream
    get playerShots$(): Observable<Array<Shot>> {

        const isVisible = (shot: Shot): boolean => {
            return shot.y > 0;
        };

        const shotsEventObservable$ = Observable.merge(
            Observable.fromEvent(this.spaceshipArea.nativeElement, 'click'),
            Observable.fromEvent(document, 'keydown')
                .filter((e: KeyboardEvent) => e.keyCode === 32)
        )
            .startWith({})
            .sampleTime(200)
            .timestamp();

        const shotsObservable$ = Observable.combineLatest(
            shotsEventObservable$, this.spaceship$,
            (shotEvent: ShotEvent, spaceship: Spaceship) => {
                return {
                    timestamp: shotEvent.timestamp,
                    x: spaceship.position.x,
                    isActive: true
                }
            })
            .distinctUntilChanged(null, (shot: Shot) => shot.timestamp)
            .scan((shotArray: Array<Shot>, shot: Shot) => {
                shotArray.push({
                    x: shot.x,
                    y: this.HERO_Y,
                    isActive: true
                });

                return shotArray;
            }, []);

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
            })
    }

    // complete stream
    get score$() {
        return this.scoreSubject$
            .scan((previousScore: number, currentScore: number) => previousScore + currentScore, 0);
    }

    static animation() {
        return Observable.generate(0, (x) => true, (x) => x + 1, (x) => x, Scheduler.animationFrame);
    }

    gameOver(spaceship: Spaceship, enemies: Array<Enemy>) {

        const collideHandler = (enemy: Enemy) => {
            // const isTouched = (SpaceshipGameComponent.collisionSpaceship(spaceship, enemy));

            // const isHit = _.some(enemy.shots, (shot: Shot) => SpaceshipGameComponent.collisionSpaceship(spaceship, shot));

            return true;
        };

        const healthHandler = () => {};

        // const isCollided = _.some(enemies, collideHandler);
        //
        // if(isCollided) {
        //
        // }
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