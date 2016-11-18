import {
  Component,
  TemplateRef,
  ViewChild,
  OnInit, ContentChildren, ElementRef
} from '@angular/core';

@Component({
  selector: 'tab',
  template: `
    <template #content>
      <ng-content></ng-content>
    </template>
  `
})

export class TabComponent implements OnInit {
  @ViewChild('content') content: TemplateRef<any>;
  el: HTMLElement;
  id: string;
  title: string;

  constructor(private elementRef: ElementRef) {
    this.el = this.elementRef.nativeElement;
  }

  ngOnInit() {
    console.log(this);
  }
}
