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
  loaderElement: HTMLElement;

  LOADED_CLASS_NAME: string = 'loaded';
  transitionendListener: Function;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer
  ) {
    this.loaderElement = this.elementRef.nativeElement.previousElementSibling;
  }

  ngOnInit() {
    this.stopLoader(this.loaderElement);
  }

  stopLoader(loaderElement: HTMLElement) {
    this.renderer.setElementClass(loaderElement, this.LOADED_CLASS_NAME, true);

    this.transitionendListener = this.renderer
      .listen(loaderElement.lastElementChild, 'transitionend', () => {
        loaderElement.parentElement.removeChild(loaderElement);
      });
  }

  ngOnDestroy() {
    this.transitionendListener();
  }
}
