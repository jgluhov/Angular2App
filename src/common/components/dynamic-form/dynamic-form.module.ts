import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

import {DynamicFormComponent} from './dynamic-form.component';
import {DynamicFormQuestionComponent} from './components/dynamic-form-question.component';
import {QuestionControlService} from './question-control.service';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [
    DynamicFormComponent,
    DynamicFormQuestionComponent
  ],
  exports: [DynamicFormComponent],
  providers: [QuestionControlService]
})

export class DynamicFormModule {}
