import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TabsComponent} from './tabs.component';
import {TabComponent} from './tab.component';
import {TabDirective} from './tab.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [TabsComponent, TabComponent, TabDirective],
  exports: [TabsComponent, TabComponent]
})

export class TabsModule {}

