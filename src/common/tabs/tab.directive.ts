import {
  Directive,
  Input,
  ViewContainerRef,
  OnInit
} from '@angular/core';

import {TabComponent} from './tab.component';

@Directive({
  selector: '[tab]'
})

export class TabDirective implements OnInit {
  @Input('tab') tab: TabComponent;

  constructor(private viewContainerRef: ViewContainerRef) {}

  ngOnInit() {
    this.viewContainerRef.createEmbeddedView(this.tab.content);
  }
}
