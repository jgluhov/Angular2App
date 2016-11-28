import {
  Component,
  OnInit,
  Renderer
} from '@angular/core';

@Component({
  selector: 'app',
  template: `<router-outlet></router-outlet>`
})

export class AppComponent implements OnInit {
  loaderElement: HTMLElement;

  LOADED_CLASS_NAME: string = 'loaded';
  transitionendListener: Function;

  constructor(private renderer: Renderer) {
    this.loaderElement = document.getElementById('loader');
  }

  ngOnInit() {
    this.stopLoader();
  }

  stopLoader() {
    this.renderer.setElementClass(this.loaderElement, this.LOADED_CLASS_NAME, true);

    this.transitionendListener = this.renderer
      .listen(this.loaderElement.lastElementChild, 'transitionend', () => {
        this.loaderElement.parentElement.removeChild(this.loaderElement);
      });
  }

  ngOnDestroy() {
    this.transitionendListener();
  }
}
