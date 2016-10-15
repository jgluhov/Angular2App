import {Component, ViewChild, ElementRef, AfterViewInit} from "@angular/core";

import {SpaceshipGameContextService} from "./spaceship-game-context.service";
import {
    GameActors,
    Star,
    Enemy,
    Shot,
    Spaceship,
    ShotEvent
} from "./spaceship-game.interface";

import {Observable, Scheduler, BehaviorSubject} from "rxjs";
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


@Component({
    selector: 'spaceship-game',
    templateUrl: './spaceship-game.component.html',
    styleUrls: ['./spaceship-game.component.styl']
})

export class SpaceshipGameComponent implements AfterViewInit {

    scoreSubject : BehaviorSubject<number>;

    STAR_NUMBER: number = 250;
    ENEMY_FREQ: number = 1500;
    ENEMY_SHOOTING_FREQ: number = 750;
    SHOOTING_SPEED = 0.5;
    ENEMY_SHOOTING_SPEED = 0.3;
    SCORE_INCREASE = 10;
    SPACE_HEIGHT = 20;
    HERO_Y: number;

    @ViewChild("spaceshipArea") spaceshipArea: ElementRef;

    constructor(private spaceshipGameContextService: SpaceshipGameContextService) {}

    ngAfterViewInit() {
        this.spaceshipGameContextService.context = this.spaceshipArea.nativeElement.getContext('2d');
        this.spaceshipGameContextService.contextAreaRef = this.spaceshipArea;

        this.HERO_Y = this.spaceshipArea.nativeElement.clientHeight - 30;

        this.scoreSubject = new BehaviorSubject(0);

        this.game$.subscribe((actors: GameActors) => {
            this.spaceshipGameContextService.renderScene(actors);
            this.animationHandler(actors);
        });
    }

    get game$() {
        return Observable.combineLatest(
            this.starStream$, this.spaceship$, this.enemies$, this.playerHeroShots$, this.score$,
            (stars, spaceship, enemies, playerHeroShots, score) => {
                return {
                    stars: stars,
                    spaceship: spaceship,
                    enemies: enemies,
                    playerHeroShots: playerHeroShots,
                    score: score
                }
            })
            .takeWhile((actors: GameActors) => {
                const isGameOver = this.gameOver(actors.spaceship, actors.enemies);
                if(isGameOver) {
                    console.log('game over');
                }
                return !isGameOver;
            })
    }

    get starStream$() {
        return Observable.range(1, this.STAR_NUMBER)
            .map(() => {
                return {
                    x: _.random(0, this.spaceshipArea.nativeElement.width),
                    y: _.random(0, this.spaceshipArea.nativeElement.height),
                    size: _.random(0, 3)
                }
            })
            .toArray()
            .switchMap((starArray: Array<Star>) => {
                return SpaceshipGameComponent.animation()
                    .map(() => {
                        _.forEach(starArray, (star: Star) => {
                            if (_.gt(star.y, this.spaceshipArea.nativeElement.height)) {
                                star.y = 0;
                            }
                            star.y += 0.1;
                        });

                        return starArray;
                    });
            });
    }

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

    get enemies$() {
        return Observable.interval(this.ENEMY_FREQ)
            .scan((enemyArray: Array<Enemy>) => {
                let enemy: Enemy = {
                    x: _.random(0, this.spaceshipArea.nativeElement.width),
                    y: -30,
                    shots: [],
                    isDead: false
                };

                Observable.interval(this.ENEMY_SHOOTING_FREQ)
                    .subscribe(() => {
                        enemy.shots.push({
                            x: enemy.x,
                            y: enemy.y
                        });

                        enemy.shots = _.filter(enemy.shots, this.isVisible.bind(this));
                    });

                enemyArray.push(enemy);
                enemyArray = _.filter(enemyArray, this.isVisible.bind(this))
                    .filter((enemy: Enemy) => !(enemy.isDead && _.isEmpty(enemy.shots)));

                return enemyArray;
            }, []);
    }

    get playerFiring$() {
        return Observable.merge(
            Observable.fromEvent(this.spaceshipArea.nativeElement, 'click'),
            Observable.fromEvent(document, 'keydown')
                .filter((e: KeyboardEvent) => e.keyCode === 32)
        )
            .startWith({})
            .sampleTime(200)
            .timestamp();
    }

    get playerHeroShots$(): Observable<Array<Shot>> {
        return Observable.combineLatest(this.playerFiring$, this.spaceship$,
            (shotEvent: ShotEvent, spaceship: Spaceship) => {
                return {
                    timestamp: shotEvent.timestamp,
                    x: spaceship.x
                }
            })
            .distinctUntilChanged(null, heroShot => heroShot.timestamp)
            .scan((shotArray: Array<Shot>, shot: Shot) => {
                shotArray.push({
                    x: shot.x,
                    y: this.HERO_Y - this.SPACE_HEIGHT
                });

                shotArray = _.filter(shotArray, (shot: Shot) => shot.y > 0);

                return shotArray;
            }, []);
    }

    animationHandler(actors: GameActors) {
        SpaceshipGameComponent.animation()
            .do(() => {
                _.forEach(actors.playerHeroShots, (shot: Shot) => {

                    _.some(actors.enemies, (enemy: Enemy) => {
                        const isDead = !enemy.isDead && SpaceshipGameComponent.collision(shot, enemy);

                        if(isDead) {
                            this.scoreSubject.next(this.SCORE_INCREASE);
                            enemy.isDead = isDead;

                            return isDead;
                        }
                    });

                    shot.y -= this.SHOOTING_SPEED;
                });

                _.forEach(actors.enemies, (enemy: Enemy) => {
                    enemy.x += _.random(-0.5, 0.5);
                    enemy.y += 0.01;

                    _(enemy.shots).forEach((shot: Shot) => {
                        shot.y += this.ENEMY_SHOOTING_SPEED;
                    })
                });
            })
            .subscribe();
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

    isVisible(target: Shot | Enemy): Boolean {
        return target.x > -40 && target.x < this.spaceshipArea.nativeElement.width + 40 &&
            target.y > -40 && target.y < this.spaceshipArea.nativeElement.height + 40;
    }

    static collision(target1: Shot | Spaceship, target2: Enemy | Shot): Boolean {
        return (target1.x > target2.x - 20 && target1.x < target2.x + 20) &&
            (target1.y > target2.y - 20 && target1.y < target2.y + 20);
    }
}