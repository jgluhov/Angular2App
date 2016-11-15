import {
  Directive,
  ElementRef,
  Renderer,
  HostListener,
  Input
} from '@angular/core';

@Directive({
  selector: '[highlight]'
})

export class HighlightDirective {

  private defaultColor = 'red';

  constructor(private el: ElementRef, private renderer: Renderer) {}

  @Input ('highlight') highlightColor: string;

  @HostListener('mouseenter') onMouseEnter() {
    this.highlight(this.highlightColor || this.defaultColor);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.highlight(null);
  }

  private highlight(color: string) {
    this.renderer.setElementStyle(this.el.nativeElement, 'backgroundColor', color);
  }
}
