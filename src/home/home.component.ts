import {
  Component,
  HostListener, EventEmitter
} from '@angular/core';

import {Title} from '@angular/platform-browser';
import {QuestionService} from '../common/components/dynamic-form/question.service';

import 'rxjs/observable/from';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toArray';

import * as Faker from 'faker';

type COORDINATE = {
  x: number,
  y: number
}

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.styl'],
  host: {
    '(mousemove)': 'mouseStream.next({ x: $event.pageX, y: $event.pageY});'
  }
})

export class HomeComponent {
  questions: any[];
  isVisible: boolean;

  mouseStream: EventEmitter<COORDINATE> = new EventEmitter<COORDINATE>();

  MAX: number = 4000;
  position: COORDINATE;

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

    this.position = {
      x: -50,
      y: -50
    };

    this.mouseStream
      .map(
        (coordinate: COORDINATE) => ({
          x: (coordinate.x - 25),
          y: (coordinate.y - 20)
        })
      )
      .map(
        (coordinate: COORDINATE) => {
          const gridSize = 25;

          return {
            x: (coordinate.x - (coordinate.x % gridSize)),
            y: (coordinate.y - (coordinate.y % gridSize))
          };
        }
      )
      .distinctUntilChanged((a: COORDINATE, b: COORDINATE) => {
        return ( (a.x === b.x) && (a.y === b.y) );
      })
      .subscribe((coordinate: COORDINATE) => {
        this.position.x = coordinate.x;
        this.position.y = coordinate.y;
      });
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
