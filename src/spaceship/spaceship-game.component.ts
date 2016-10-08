import {Component, ViewChild, ElementRef, AfterViewInit} from "@angular/core";

@Component({
    selector: 'spaceship-game',
    templateUrl: './spaceship-game.component.html',
    styleUrls: ['./spaceship-game.component.styl']
})

export class SpaceshipGameComponent implements AfterViewInit {
    context: CanvasRenderingContext2D;

    @ViewChild("spaceshipArea") spaceshipArea: ElementRef;

    constructor() {

    }

    ngAfterViewInit() {
        this.context = this.spaceshipArea.nativeElement.getContext('2d');
    }
}