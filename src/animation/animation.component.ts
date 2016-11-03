import {Component, trigger, state, style} from '@angular/core';

@Component({
  animations: [
    trigger('signal', [
      state('go', style({
        'background-color': 'green'
      })),
      state('stop', style({
        'background-color': 'red'
      }))
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
}
