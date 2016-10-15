import {Component, ViewChild, ElementRef, AfterViewInit} from "@angular/core";
import {Observable, Scheduler, Timestamp} from "rxjs";
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
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/mergeAll';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/distinctUntilChanged';
import chain = require("lodash/chain");

interface Star {
    x: number,
    y: number,
    size: number
}

interface Shot {
    x: number,
    y?: number,
    timestamp?: number
}

interface Enemy {
    x: number,
    y: number,
    shots: Array<Shot>
}

interface Spaceship {
    x: number,
    y: number
}

interface ShotEvent {
    timestamp: number,
    value: Object | MouseEvent
}

interface GameActors {
    stars: Array<Star>
    spaceship: Spaceship
    enemies: Array<Enemy>
    heroShots: Array<Shot>
}

@Component({
    selector: 'spaceship-game',
    templateUrl: './spaceship-game.component.html',
    styleUrls: ['./spaceship-game.component.styl']
})

export class SpaceshipGameComponent implements AfterViewInit {
    context: CanvasRenderingContext2D;

    STAR_NUMBER: number = 250;
    ENEMY_FREQ: number = 1500;
    ENEMY_SHOOTING_FREQ: number = 750;
    SHOOTING_SPEED = 15;
    HERO_Y: number;

    @ViewChild("spaceshipArea") spaceshipArea: ElementRef;

    ngAfterViewInit() {
        this.spaceshipArea.nativeElement.width = this.spaceshipArea.nativeElement.clientWidth;
        this.spaceshipArea.nativeElement.height = this.spaceshipArea.nativeElement.clientHeight;

        this.context = this.spaceshipArea.nativeElement.getContext('2d');

        this.HERO_Y = this.spaceshipArea.nativeElement.clientHeight - 30;

        this.game$.subscribe((actors: GameActors) => this.renderScene(actors));
    }

    get game$() {
        return Observable.combineLatest(
            this.starStream$, this.spaceship$, this.enemies$, this.heroShots$,
            (stars, spaceship, enemies, heroShots) => {
                return {
                    stars: stars,
                    spaceship: spaceship,
                    enemies: enemies,
                    heroShots: heroShots
                }
            });
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
                    shots: []
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
                enemyArray = _.filter(enemyArray, this.isVisible.bind(this));

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

    get heroShots$(): Observable<Array<Shot>> {
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
                    y: this.HERO_Y
                });

                return shotArray;
            }, []);
    }

    static animation() {
        return Observable.generate(0, (x) => true, (x) => x + 1, (x) => x, Scheduler.animationFrame);
    }

    isVisible(object: Shot | Enemy) : Boolean {
        return object.x > - 40 && object.x < this.spaceshipArea.nativeElement.width + 40 &&
            object.y > - 40 && object.y < this.spaceshipArea.nativeElement.height + 40;
    }

    renderScene(actors: GameActors) {
        this.paintStars(actors.stars);
        this.paintSpaceship(actors.spaceship);
        this.paintEnemies(actors.enemies);
        this.paintHeroShots(actors.heroShots);
    }

    paintStars(stars: Array<Star>) {
        this.context.fillStyle = '#000000';
        this.context.fillRect(0, 0, this.spaceshipArea.nativeElement.width, this.spaceshipArea.nativeElement.height);
        this.context.fillStyle = '#ffffff';

        _.forEach(stars, (star: Star) => this.context.fillRect(star.x, star.y, star.size, star.size));
    }

    paintSpaceship(spaceship: Spaceship) {
        this.drawTriangle(spaceship.x, spaceship.y, 20, '#ff0000', 'up');
    }

    paintEnemies(enemies: Array<Enemy>) {
        _.chain(enemies)
            .forEach((enemy: Enemy) => {
                enemy.x += _.random(-5, 5);
                enemy.y += 1;
            })
            .forEach((enemy: Enemy) => {
                this.drawTriangle(enemy.x, enemy.y, 20, '#00ff00', 'down');
            })
            .forEach((enemy: Enemy) => {
                _(enemy.shots).forEach((shot: Shot) => {
                    shot.y += this.SHOOTING_SPEED;
                    this.drawTriangle(shot.x, shot.y, 5, '#00ffff', 'down');
                })
            })
            .value();
    }

    paintHeroShots(heroShots: Array<Shot>) {
        heroShots.forEach(shot => {
            shot.y -= this.SHOOTING_SPEED;
            this.drawTriangle(shot.x, shot.y, 5, '#ffff00', 'up');
        });
    }

    drawTriangle(x: number, y: number, width: number, color: string, direction: string) {
        this.context.fillStyle = color;
        this.context.beginPath();
        this.context.moveTo(x - width, y);
        this.context.lineTo(x, direction === 'up' ? y - width : y + width);
        this.context.lineTo(x + width, y);
        this.context.lineTo(x - width, y);
        this.context.fill();
    }
}