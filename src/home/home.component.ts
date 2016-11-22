import {
  Component,
  HostListener
} from '@angular/core';

import {Title} from '@angular/platform-browser';
import {QuestionService} from '../common/components/dynamic-form/question.service';

import {Observable} from 'rxjs';
import 'rxjs/observable/from';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toArray';

import * as Faker from 'faker';

@Component({
  templateUrl: './home.component.html'
})

export class HomeComponent {
  questions: any[];
  isVisible: boolean;

  MAX: number = 4000;

  @HostListener('dblclick') onClick() {
    this.isVisible = !this.isVisible;
  }

  constructor(
    private titleService: Title,
    private questionService: QuestionService
  ) {

    console.log(Faker);
    this.setTitle('Home page');
    this.questions = questionService.getQuestions();
    this.isVisible = false;
  }

  private get dataSet() {
    const dataArray = new Array(this.MAX).fill(0);
    return dataArray.map(this.factory.bind(this));
  }

  private get columns() {
    return [
      {
        title: 'Index'
      },
      {
        title: 'First name'
      },
      {
        title: 'Last name'
      },
      {
        title: 'Email'
      },
      {
        title: 'Phone'
      }
    ];
  }

  public get tableConfiguration() {
    return {
      data: this.dataSet,
      columns: this.columns,
      height: 400
    };
  }

  private toDateTimeFormat(date: Date) {
    return new Intl.DateTimeFormat('en-US', this.dateOptions)
      .format(date);
  }

  private factory(value: number, index: number): Object {
    return {
      id: index,
      firstName: Faker.name.firstName(),
      lastName: Faker.name.lastName(),
      email: Faker.internet.email(),
      phone: Faker.phone.phoneNumber()
    };
  }



  private get dateOptions() {
    return {
      year: 'numeric',
        month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    };
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }
}
