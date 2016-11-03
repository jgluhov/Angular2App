import {Component, trigger, state, style, transition, animate} from '@angular/core';

@Component({
  animations: [
    trigger('signal', [
      state('go', style({
        'background-color': 'green',
        'height': '100px'
      })),
      state('stop', style({
        'background-color': 'red',
        'height': '50px'
      })),
      transition('* => *', animate(500))
    ])
  ],
  templateUrl: './animation.component.html',
  styleUrls: ['./animation.component.styl']
})

export class AnimationComponent {
  signal = 'stop';

  onGoClick() {
    this.signal = 'go';
  }

  onStopClick() {
    this.signal = 'stop';
  }
}
