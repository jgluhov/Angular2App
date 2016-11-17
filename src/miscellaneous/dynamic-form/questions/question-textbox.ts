import {QuestionBase} from './question-base';
import {IQuestionOptions} from './question.interfaces';

export class TextboxQuestion extends QuestionBase<string> {
  controlType = 'textbox';
  type: string;

  constructor(options: IQuestionOptions = {}) {
    super(options);
    this.type = options.type || '';
  }
}
