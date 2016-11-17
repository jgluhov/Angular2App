import {Injectable} from '@angular/core';
import {QuestionBase} from './questions/question-base';
import {DropdownQuestion} from './questions/question-dropdown';
import {TextboxQuestion} from './questions/question-textbox';

@Injectable()
export class QuestionService {
  getQuestions() {
    let questions: QuestionBase<any> [] = [

      new DropdownQuestion({
        key: 'brave',
        label: 'Bravery Rating',
        options: [
          {key: 'solid',  value: 'Solid'},
          {key: 'great',  value: 'Great'},
          {key: 'good',   value: 'Good'},
          {key: 'unproven', value: 'Unproven'}
        ],
        order: 3
      }),

      new TextboxQuestion({
        key: 'firstName',
        type: 'text',
        label: 'First name',
        value: 'JGluhov',
        required: true,
        order: 1
      }),

      new TextboxQuestion({
        key: 'emailAddress',
        label: 'Email',
        type: 'email',
        order: 2
      })

    ];

    return questions.sort((a, b) => a.order - b.order);
  }
}
