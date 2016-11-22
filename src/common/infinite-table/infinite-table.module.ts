import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {InfiniteTableComponent} from './infinite-table.component';
import {ContentDirective} from './content.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [InfiniteTableComponent, ContentDirective],
  exports: [InfiniteTableComponent]
})

export class InfiniteTableModule {}

