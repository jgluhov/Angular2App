import {
  Component,
  OnInit,
  ElementRef,
  Renderer
} from '@angular/core';


@Component({
  selector: 'app',
  template: `
    <router-outlet></router-outlet>
  `
})

export class AppComponent implements OnInit {
  loader: HTMLElement;

  constructor(private elementRef: ElementRef, private renderer: Renderer) {
    this.loader = this.elementRef.nativeElement.previousElementSibling;
  }

  ngOnInit() {
    this.renderer.setElementClass(this.loader, 'loaded', true);
  }
}
