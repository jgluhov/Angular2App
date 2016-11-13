import {
  trigger,
  style,
  state,
  transition,
  animate
} from '@angular/core';

export default [
  trigger('itemState', [
    state('inactive', style({
      'color': '#777',
      'transform': 'scale(1)'
    })),
    state('active', style({
      'color': '#e6e6e6',
      'transform': 'scale(1.05)',
      'font-weight': 600
    })),
    transition('* => active', animate('.1s ease-in')),
    transition('* => inactive', animate('.1s ease-out'))
  ])
];


