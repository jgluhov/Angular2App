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

@Component({
    selector: 'spaceship-game',
    templateUrl: './spaceship-game.component.html',
    styleUrls: ['./spaceship-game.component.styl']
})

export class SpaceshipGameComponent implements AfterViewInit {
    context: CanvasRenderingContext2D;

    STAR_NUMBER: number = 250;
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
        return Observable.combineLatest(this.starStream$, this.spaceship$, (stars, spaceship) => {
            return {
                stars: stars, spaceship: spaceship
            }
        })
    }

    get starStream$() {
        return Observable.range(1, this.STAR_NUMBER)
            .map(() => {
                return {
                    x: +(Math.random() * this.spaceshipArea.nativeElement.width),
                    y: +(Math.random() * this.spaceshipArea.nativeElement.height),
                    size: Math.random() * 2 + 1
                }
            })
            .toArray()
            .switchMap(starArray => {
                return this.animation()
                    .map(() => {
                        starArray.forEach(star => {
                            if(star.y >= this.spaceshipArea.nativeElement.height) {
                                star.y = 0;
                            }
                            star.y += 0.1;
                        });

                        return starArray;
                    });
            })

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
            })
    }

    animation() {
        return Observable.generate(0, (x) => true, (x) => x + 1, (x) => x, Scheduler.animationFrame);
    }

    renderScene(actors: any) {
        this.paintStars(actors.stars);
        this.paintSpaceship(actors.spaceship);
    }

    paintStars(stars:any) {
        this.context.fillStyle = '#000000';
        this.context.fillRect(0, 0, this.spaceshipArea.nativeElement.width, this.spaceshipArea.nativeElement.height);
        this.context.fillStyle = '#ffffff';

        stars.forEach((star:any) => this.context.fillRect(star.x, star.y, star.size, star.size));
    }

    paintSpaceship(spaceship:any) {
        this.drawTriangle(spaceship.x, spaceship.y, 20, '#ff0000', 'up');
    }

    drawTriangle(x:number, y:number, width:number, color:string, direction:string) {
        this.context.fillStyle = color;
        this.context.beginPath();
        this.context.moveTo(x - width, y);
        this.context.lineTo(x, direction === 'up' ? y - width : y + width);
        this.context.lineTo(x + width, y);
        this.context.lineTo(x - width, y);
        this.context.fill();
    }
}