import {Component} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {QuestionService} from '../common/components/dynamic-form/question.service';

@Component({
  templateUrl: './home.component.html'
})

export class HomeComponent {
  questions: any[];

  constructor(private titleService: Title, questionService: QuestionService) {
    this.setTitle('Home page');
    this.questions = questionService.getQuestions();
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }
}
