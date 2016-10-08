import {NgModule} from "@angular/core";
import {SpaceshipComponent} from "./spaceship.component";
import spaceshipRoutes from './spaceship.routes'

@NgModule({
    imports: [spaceshipRoutes],
    declarations: [SpaceshipComponent]
})

export class SpaceshipModule {}
