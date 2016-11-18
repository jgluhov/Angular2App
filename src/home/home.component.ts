import {
  Component, HostListener
} from '@angular/core';

import {Title} from '@angular/platform-browser';
import {QuestionService} from '../common/components/dynamic-form/question.service';

@Component({
  templateUrl: './home.component.html'
})

export class HomeComponent {
  questions: any[];
  isVisible: boolean;

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

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }
}
