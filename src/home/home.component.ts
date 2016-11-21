import {
  Component, HostListener
} from '@angular/core';

import {Title} from '@angular/platform-browser';
import {QuestionService} from '../common/components/dynamic-form/question.service';

import {Observable} from 'rxjs';
import 'rxjs/observable/from';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toArray';

@Component({
  templateUrl: './home.component.html'
})

export class HomeComponent {
  questions: any[];
  isVisible: boolean;

  MAX: number = 1000;

  @HostListener('dblclick') onClick() {
    this.isVisible = !this.isVisible;
  }

  constructor(
    private titleService: Title,
    private questionService: QuestionService
  ) {
    this.setTitle('Home page');
    this.questions = questionService.getQuestions();
    this.isVisible = false;
  }

  get data$() {
    const dataArray = new Array(this.MAX);

    return Observable.from(dataArray.fill(0))
      .map(HomeComponent.generate)
      .toArray();
  }

  static generate(value: number, index: number): Object {
    return {
      index: index,
      value: String.fromCharCode(index)
    };
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }
}
