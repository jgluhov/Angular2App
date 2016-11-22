import {
  Directive,
  ElementRef,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  Input,
  Renderer
} from '@angular/core';

import {Observable, Subscription} from 'rxjs';

@Directive({
  selector: '[content]'
})

export class ContentDirective implements OnInit, OnDestroy {
  @Output() onScroll: EventEmitter<any> = new EventEmitter<any>();

  @Input('contentHeight') contentHeight: number;

  position$: Observable<number>;
  sub: Subscription;

  INITIAL_POSITION: number = 0;

  constructor(private el: ElementRef, private renderer: Renderer) {

    this.position$ = Observable
      .fromEvent(el.nativeElement, 'scroll', (e: Event) => e.target)
      .map((target: Element) => target.scrollTop);

    this.sub = this.position$
      .subscribe((position: number) => this.onScroll.emit(position));
  }

  ngOnInit() {
    this.renderer.setElementStyle(this.el.nativeElement, 'height', this.contentHeight + 'px');

    this.onScroll.emit(this.INITIAL_POSITION);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
