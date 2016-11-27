import {
  Component,
  OnInit,
  ElementRef,
  Renderer
} from '@angular/core';
import {AppService} from './app.service';


@Component({
  selector: 'app',
  template: `
    <router-outlet></router-outlet>
  `
})

export class AppComponent implements OnInit {
  loaderElement: HTMLElement;

  constructor(
    private elementRef: ElementRef,
    private appService: AppService,
    private renderer: Renderer
  ) {
    this.loaderElement = this.elementRef.nativeElement.previousElementSibling;
  }

  ngOnInit() {
    this.appService.stopLoader(this.renderer, this.loaderElement);
  }
}
