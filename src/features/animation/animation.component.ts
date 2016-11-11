import {
  Component,
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes
} from '@angular/core';

@Component({
  animations: [
    trigger('signal', [
      state('void', style({
        'transform': 'translateY(-100%)'
      })),
      state('go', style({
        'background-color': 'green',
        'height': '100px'
      })),
      state('stop', style({
        'background-color': 'red',
        'height': '50px'
      })),
      transition('void <=> *', animate(1000, keyframes([
        style({'transform': 'scale(0)'}),
        style({'transform': 'scale(.9)'}),
        style({'transform': 'scale(.1)'}),
        style({'transform': 'scale(.9)'}),
        style({'transform': 'scale(.5)'}),
        style({'transform': 'scale(1)'}),
      ]))),
      transition('go <=> stop', animate('.5s 1s ease-out'))
    ])
  ],
  templateUrl: './animation.component.html',
  styleUrls: ['./animation.component.styl']
})

export class AnimationComponent {
  signal: string;
  isVisible: boolean = false;

  onGoClick() {
    this.signal = 'go';
  }

  onStopClick() {
    this.signal = 'stop';
  }

  onToggleState() {
    this.isVisible = !this.isVisible;
  }
}
