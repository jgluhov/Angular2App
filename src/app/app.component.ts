import {
  Component,
  OnInit
} from '@angular/core';
import {NgSpinningPreloader} from 'ng2-spinning-preloader';

@Component({
  selector: 'app',
  template: `<router-outlet></router-outlet>`
})

export class AppComponent implements OnInit {

  constructor(private ngSpinningPreloader: NgSpinningPreloader) {}

  ngOnInit() {
    this.ngSpinningPreloader.stop();
  }
}
