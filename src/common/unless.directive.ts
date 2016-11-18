import {
  Directive,
  Input, TemplateRef, ViewContainerRef
} from '@angular/core';

@Directive({
  selector: '[unless]'
})

export class UnlessDirective {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef
  ) {}

  @Input() set unless(condition: boolean) {
    condition ?
      this.viewContainerRef.createEmbeddedView(this.templateRef) :
      this.viewContainerRef.clear();
  }
}
