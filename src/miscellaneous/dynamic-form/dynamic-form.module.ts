import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DynamicFormComponent} from './dynamic-form.component';
import dynamicFormRoutes from './dynamic-form.routes';

@NgModule({
  imports: [CommonModule, dynamicFormRoutes],
  declarations: [DynamicFormComponent]
})

export class DynamicFormModule {}
