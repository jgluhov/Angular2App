import {
  Component,
  OnInit,
  Input
} from '@angular/core';

import {QuestionBase} from './questions/question-base';
import {QuestionControlService} from './question-control.service';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'dynamic-form',
  templateUrl: './dynamic-form.component.html'
})

export class DynamicFormComponent implements OnInit {
  @Input() questions: QuestionBase<any>[] = [];

  form: FormGroup;
  payLoad = '';

  constructor(private qcs: QuestionControlService) {}

  ngOnInit() {
    this.form = this.qcs.toFormGroup(this.questions);
  }

  onSubmit() {
    this.payLoad = JSON.stringify(this.form.value);
  }
}

