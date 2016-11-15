import {NgModule} from '@angular/core';
import {AnimationComponent} from './animation.component';
import animationRoutes from './animation.routes';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [CommonModule, animationRoutes],
  declarations: [AnimationComponent]
})

export class AnimationModule {}
