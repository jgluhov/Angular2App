import {Injectable, ElementRef, OnDestroy} from '@angular/core';
import {GameActors, Star, Spaceship, Enemy, Shot} from './spaceship-game.interface';

Injectable();
export class SpaceshipGameContextService implements OnDestroy {

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
        this.paintPlayerShots(actors.playerShots);
        this.paintScore(actors.score);
        this.paintHealth(actors.health);
    }

    renderWelcomeScreen() {
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.spaceshipArea.nativeElement.width, this.spaceshipArea.nativeElement.height);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(
          this.spaceshipArea.nativeElement.width / 2 - 100,
          this.spaceshipArea.nativeElement.height / 2 - 50,
          200,
          100
        );
        this.ctx.fillStyle = '#000000';
        this.ctx.font = 'bold 30px sans-serif';
        this.ctx.fillText(
          'START',
          this.spaceshipArea.nativeElement.width / 2 - 50,
          this.spaceshipArea.nativeElement.height / 2 + 10
        );
    }

    paintStars(stars: Array<Star>) {
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.spaceshipArea.nativeElement.width, this.spaceshipArea.nativeElement.height);
        this.ctx.fillStyle = '#ffffff';

        _.forEach(stars, (star: Star) => this.ctx.fillRect(star.x, star.y, star.size, star.size));
    }

    paintSpaceship(spaceship: Spaceship) {
        this.drawTriangle(spaceship.position.x, spaceship.position.y, 20, '#ff0000', 'up');
    }

    paintEnemies(enemies: Array<Enemy>) {
        _.chain(enemies)
            .filter((enemy: Enemy) => !enemy.isDead)
            .forEach((enemy: Enemy) => this.drawTriangle(enemy.x, enemy.y, 20, '#00ff00', 'down'))
            .value();

        _.forEach(enemies, (enemy: Enemy) => {
            _.chain(enemy.shots)
                .filter((shot: Shot) => shot.isActive)
                .forEach((shot: Shot) => this.drawTriangle(shot.x, shot.y, 5, '#00ffff', 'down'))
                .value();
        });
    }

    paintPlayerShots(playerShots: Array<Shot>) {
        _.forEach(playerShots, (shot: Shot) => {
            this.drawTriangle(shot.x, shot.y, 5, '#ffff00', 'up');
        });
    }

    paintScore(score: number) {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 26px sans-serif';
        this.ctx.fillText('Score: ' + score, 40, 43);
    }

    paintHealth(health: number) {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 26px sans-serif';
        this.ctx.fillText('Health: ' + health, 40, 73);
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

    ngOnDestroy() {
        this.ctx = null;
        this.spaceshipArea = null;
    }
}
