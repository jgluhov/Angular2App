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


@Component({
    selector: 'spaceship-game',
    templateUrl: './spaceship-game.component.html',
    styleUrls: ['./spaceship-game.component.styl']
})

export class SpaceshipGameComponent implements AfterViewInit, OnInit {

    scoreSubject: BehaviorSubject<number>;
    enemies$: Subject<Array<Enemy>>;

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
        this.enemies$ = new Subject<Array<Enemy>>();
        this.enemiesObservable$.subscribe(this.enemies$);
    }

    ngAfterViewInit() {
        this.spaceshipGameContextService.context = this.spaceshipArea.nativeElement.getContext('2d');
        this.spaceshipGameContextService.contextAreaRef = this.spaceshipArea;

        this.HERO_Y = this.spaceshipArea.nativeElement.clientHeight - 30;

        this.scoreSubject = new BehaviorSubject(0);

        this.game$.subscribe((actors: GameActors) => this.spaceshipGameContextService.renderScene(actors));
    }

    get game$() {


        return Observable.combineLatest(
            this.starStream$, this.spaceship$, this.enemies$, this.playerShots$,
            (stars, spaceship, enemies, playerShots) => {
                return {
                    stars: stars,
                    spaceship: spaceship,
                    enemies: enemies,
                    playerShots: playerShots,
                    // score: score
                }
            })
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
    get spaceship$() {
        return Observable.fromEvent(this.spaceshipArea.nativeElement, 'mousemove')
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
    }

    // complete stream
    get enemiesObservable$() {

        const isVisible = (target: Shot | Enemy): boolean => {
            return target.x > -this.ENEMY_SPACESHIP_WIDTH &&
                target.x < this.spaceshipArea.nativeElement.width + this.ENEMY_SPACESHIP_WIDTH &&
                target.y > -this.ENEMY_SPACESHIP_WIDTH &&
                target.y < this.spaceshipArea.nativeElement.height + this.ENEMY_SPACESHIP_WIDTH;
        };

        const isAlive = (enemy: Enemy): boolean => {
            if (enemy.isDead) {
                console.log('isDead:', enemy.isDead);
            }
            return !(enemy.isDead && _.isEmpty(enemy.shots));
        };

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
                            y: enemy.y
                        });

                        enemy.shots = _.filter(enemy.shots, isVisible);
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

                _.forEach(enemy.shots, (shot: Shot) => {
                    shot.y += this.ENEMY_SHOOTING_SPEED;
                })
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
                    x: spaceship.x
                }
            })
            .distinctUntilChanged(null, (shot: Shot) => shot.timestamp)
            .scan((shotArray: Array<Shot>, shot: Shot) => {
                shotArray.push({
                    x: shot.x,
                    y: this.HERO_Y
                });

                return shotArray;
            }, []);

        return Observable.combineLatest(
            shotsObservable$, this.enemies$, SpaceshipGameComponent.animation(),
            (shotArray: Array<Shot>, enemyArray: Array<Enemy>) => {
                shotArray = _.filter(shotArray, isVisible);

                _.forEach(shotArray, (shot: Shot) => {
                    _.forEach(enemyArray, (enemy: Enemy) => {
                        const isDead = !enemy.isDead && SpaceshipGameComponent.collision(shot, enemy);

                        if (isDead) {
                            this.scoreSubject.next(this.SCORE_INCREASE);
                            enemy.isDead = isDead;
                        }
                    });

                    shot.y -= this.SHOOTING_SPEED;
                });

                return shotArray;
            })
    }

    get score$() {
        return this.scoreSubject.scan((previousScore: number, currentScore: number) => previousScore + currentScore, 0);
    }

    static animation() {
        return Observable.generate(0, (x) => true, (x) => x + 1, (x) => x, Scheduler.animationFrame);
    }

    gameOver(ship: Spaceship, enemies: Array<Enemy>) {
        return _.some(enemies, (enemy: Enemy) => {

            const touching = (SpaceshipGameComponent.collision(ship, enemy));

            const hitting = _.some(enemy.shots, (shot: Shot) => {
                return SpaceshipGameComponent.collision(ship, shot);
            });

            return touching || hitting;
        });
    }

    static collision(target1: Shot | Spaceship, target2: Enemy | Shot): Boolean {
        return (target1.x > target2.x - 20 && target1.x < target2.x + 20) &&
            (target1.y > target2.y - 20 && target1.y < target2.y + 20);
    }
}