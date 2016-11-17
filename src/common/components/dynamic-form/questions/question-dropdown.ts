import {QuestionBase} from './question-base';
import {IDropdownOption} from './question.interfaces';

export class DropdownQuestion extends QuestionBase<string> {
  controlType = 'dropdown';
  options: IDropdownOption[] = [];

  constructor(options: {} = {}) {
    super(options);

    this.options = options['options'] || [];
  }
}
