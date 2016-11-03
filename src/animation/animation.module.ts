import {NgModule} from '@angular/core';
import {AnimationComponent} from './animation.component';
import animationRoutes from './animation.routes';

@NgModule({
  imports: [animationRoutes],
  declarations: [AnimationComponent]
})

export class AnimationModule {}
