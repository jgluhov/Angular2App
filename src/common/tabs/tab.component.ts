import {
  Component,
  TemplateRef,
  ViewChild,
  Attribute
} from '@angular/core';

@Component({
  selector: 'tab',
  template: `
    <template #content>
      <ng-content></ng-content>
    </template>
  `
})

export class TabComponent {
  @ViewChild('content') content: TemplateRef<any>;

  constructor(
    @Attribute('id') private id: string,
    @Attribute('title') private title: string
  ) {}

  get href() {
    return '#' + this.id;
  }

  get name() {
    return this.id;
  }
}
