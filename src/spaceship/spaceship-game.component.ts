import {Component, ViewChild, ElementRef, AfterViewInit} from "@angular/core";
import {Observable, Scheduler} from "rxjs";
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
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/distinctUntilChanged';
import chain = require("lodash/chain");

interface Star {
    x: number,
    y: number,
    size: number
}

interface Enemy {
    x: number,
    y: number
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
    SHOOTING_SPEED = 15;
    HERO_Y: number;

    @ViewChild("spaceshipArea") spaceshipArea: ElementRef;

    ngAfterViewInit() {
        this.spaceshipArea.nativeElement.width = this.spaceshipArea.nativeElement.clientWidth;
        this.spaceshipArea.nativeElement.height = this.spaceshipArea.nativeElement.clientHeight;

        this.context = this.spaceshipArea.nativeElement.getContext('2d');

        this.HERO_Y = this.spaceshipArea.nativeElement.clientHeight - 30;

        this.game$.subscribe((actors) => this.renderScene(actors));
    }

    get game$() {
        return Observable.combineLatest(
            this.starStream$, this.spaceship$, this.enemies$,
            (stars, spaceship, enemies) => {
                return {
                    stars: stars, spaceship: spaceship, enemies: enemies
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
            .scan((enemyArray: any) => {
                enemyArray.push({
                    x: _.random(0, this.spaceshipArea.nativeElement.width),
                    y: -30
                });
                return enemyArray;
            }, []);
    }

    // get playerFiring$() {
    //     return Observable.merge(
    //         Observable.fromEvent(this.spaceshipArea.nativeElement, 'click'),
    //         Observable.fromEvent(document, 'keydown')
    //             .filter((e: KeyboardEvent) => e.keyCode === 32)
    //     )
    //         .startWith({})
    //         .sampleTime(200)
    //         .timestamp();
    //
    // }

    // get heroShots$() {
    //     return Observable.combineLatest(
    //         this.playerFiring$, this.spaceship$,
    //             (shotEvents, spaceship) => {
    //                 return {
    //                     timestamp: shotEvents.timestamp,
    //                     x: spaceship.x
    //                 }
    //         })
    //         .distinctUntilChanged((shot: any) => shot.timestamp)
    //         .scan((shotArray: any, shot: any) => {
    //             shotArray.push({
    //                 x: shot.x,
    //                 y: this.HERO_Y
    //             });
    //             return shotArray;
    //         }, []);
    // }

    static animation() {
        return Observable.generate(0, (x) => true, (x) => x + 1, (x) => x, Scheduler.animationFrame);
    }

    renderScene(actors: any) {
        this.paintStars(actors.stars);
        this.paintSpaceship(actors.spaceship);
        this.paintEnemies(actors.enemies);
        // this.paintHeroShots(actors.heroShots);
    }

    paintStars(stars: any) {
        this.context.fillStyle = '#000000';
        this.context.fillRect(0, 0, this.spaceshipArea.nativeElement.width, this.spaceshipArea.nativeElement.height);
        this.context.fillStyle = '#ffffff';

        stars.forEach((star: any) => this.context.fillRect(star.x, star.y, star.size, star.size));
    }

    paintSpaceship(spaceship: any) {
        this.drawTriangle(spaceship.x, spaceship.y, 20, '#ff0000', 'up');
    }

    paintEnemies(enemies: Array<any>) {
        _.chain(enemies)
            .forEach((enemy: Enemy) => {
                enemy.x += _.random(-5, 5);
                enemy.y += 1;
            })
            .forEach((enemy: Enemy) => {
                this.drawTriangle(enemy.x, enemy.y, 20, '#00ff00', 'down');
            })
            .value();
    }

    paintHeroShots(heroShots: Array<any>) {
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