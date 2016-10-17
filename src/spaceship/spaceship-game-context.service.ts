import {Injectable, ElementRef} from "@angular/core";
import {GameActors, Star, Spaceship, Enemy, Shot} from "./spaceship-game.interface";

Injectable();
export class SpaceshipGameContextService {

    ctx: CanvasRenderingContext2D;
    spaceshipArea: ElementRef;

    set context(context: CanvasRenderingContext2D) {
        this.ctx = context;
    }

    set contextAreaRef(areaRef: ElementRef) {
        this.spaceshipArea = areaRef;
        this.initContextArea();
    }

    initContextArea() {
        this.spaceshipArea.nativeElement.width = this.spaceshipArea.nativeElement.clientWidth;
        this.spaceshipArea.nativeElement.height = this.spaceshipArea.nativeElement.clientHeight;
    }

    renderScene(actors: GameActors) {
        this.paintStars(actors.stars);
        this.paintSpaceship(actors.spaceship);
        this.paintEnemies(actors.enemies);
        // this.paintPlayerHeroShots(actors.playerHeroShots);
        // this.paintScore(actors.score);
    }

    paintStars(stars: Array<Star>) {
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.spaceshipArea.nativeElement.width, this.spaceshipArea.nativeElement.height);
        this.ctx.fillStyle = '#ffffff';

        _.forEach(stars, (star: Star) => this.ctx.fillRect(star.x, star.y, star.size, star.size));
    }

    paintSpaceship(spaceship: Spaceship) {
        this.drawTriangle(spaceship.x, spaceship.y, 20, '#ff0000', 'up');
    }

    paintEnemies(enemies: Array<Enemy>) {
        _.forEach(enemies, (enemy: Enemy) => {
            if (!enemy.isDead) {
                this.drawTriangle(enemy.x, enemy.y, 20, '#00ff00', 'down');

                _(enemy.shots).forEach((shot: Shot) => {
                    this.drawTriangle(shot.x, shot.y, 5, '#00ffff', 'down');
                })
            }
        })
    }

    paintPlayerHeroShots(playerHeroShots: Array<Shot>) {
        _.forEach(playerHeroShots, (shot: Shot) => {
            this.drawTriangle(shot.x, shot.y, 5, '#ffff00', 'up');
        })
    }

    paintScore(score: number) {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 26px sans-serif';
        this.ctx.fillText('Score: ' + score, 40, 43);
    }

    drawTriangle(x: number, y: number, width: number, color: string, direction: string) {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(x - width, y);
        this.ctx.lineTo(x, direction === 'up' ? y - width : y + width);
        this.ctx.lineTo(x + width, y);
        this.ctx.lineTo(x - width, y);
        this.ctx.fill();
    }
}
