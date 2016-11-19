import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {HomeComponent} from './home.component';
import homeRoutes from './home.routes';

import {DynamicFormModule} from '../common/components/dynamic-form/dynamic-form.module';
import {QuestionService} from '../common/components/dynamic-form/question.service';

import {UnlessDirective} from '../common/unless.directive';

import {TabsModule} from '../common/tabs/tabs.module';
import {InfiniteTableModule} from '../common/infinite-table/infinite-table.module';

@NgModule({
  imports: [
    CommonModule,
    homeRoutes,
    DynamicFormModule,
    TabsModule,
    InfiniteTableModule
  ],
  declarations: [
    HomeComponent,
    UnlessDirective
  ],
  providers: [
    QuestionService
  ]
})

export class HomeModule {}
