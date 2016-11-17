import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeComponent} from './home.component';
import homeRoutes from './home.routes';
import {DynamicFormModule} from '../miscellaneous/dynamic-form/dynamic-form.module';
import {QuestionService} from '../miscellaneous/dynamic-form/question.service';

@NgModule({
  imports: [
    CommonModule,
    homeRoutes,
    DynamicFormModule
  ],
  declarations: [HomeComponent],
  providers: [QuestionService]
})

export class HomeModule {}
