import {Injectable, Renderer, OnDestroy} from '@angular/core';

@Injectable()
export class AppService implements OnDestroy {
  LOADED_CLASS_NAME: string = 'loaded';
  transitionendListener: Function;

  stopLoader(renderer: Renderer, loaderElement: HTMLElement) {
    renderer.setElementClass(loaderElement, this.LOADED_CLASS_NAME, true);

    this.transitionendListener = renderer
      .listen(loaderElement.lastElementChild, 'transitionend', () => {
        renderer.setElementStyle(loaderElement, 'display', 'none');
      });
  }

  ngOnDestroy() {
    this.transitionendListener();
  }
}
