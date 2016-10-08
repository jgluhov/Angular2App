import {NgModule} from "@angular/core";
import {SpaceshipComponent} from "./spaceship.component";
import spaceshipRoutes from './spaceship.routes'
import {SpaceshipGameComponent} from "./spaceship-game.component";

@NgModule({
    imports: [spaceshipRoutes],
    declarations: [SpaceshipComponent, SpaceshipGameComponent]
})

export class SpaceshipModule {}
