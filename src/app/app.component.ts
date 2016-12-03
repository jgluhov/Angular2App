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
  spinnerElement: Element;

  LOADED_CLASS_NAME: string = 'complete';
  transitionendListener: Function;

  constructor(private renderer: Renderer) {
    this.spinnerElement = document.querySelector('.spinner-preloader-container');
  }

  ngOnInit() {
    this.stop();
  }

  stop() {
    this.renderer.setElementClass(this.spinnerElement, this.LOADED_CLASS_NAME, true);

    this.transitionendListener = this.renderer
      .listen(this.spinnerElement, 'transitionend', () => {
        this.spinnerElement.parentElement.removeChild(this.spinnerElement);
      });
  }

  ngOnDestroy() {
    this.transitionendListener();
  }
}
