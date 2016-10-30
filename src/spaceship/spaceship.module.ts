import {NgModule} from '@angular/core';
import {SpaceshipComponent} from './spaceship.component';
import spaceshipRoutes from './spaceship.routes';
import {SpaceshipGameComponent} from './spaceship-game.component';
import {SpaceshipGameContextService} from './spaceship-game-context.service';

@NgModule({
    imports: [spaceshipRoutes],
    declarations: [SpaceshipComponent, SpaceshipGameComponent],
    providers: [SpaceshipGameContextService]
})

export class SpaceshipModule {}
