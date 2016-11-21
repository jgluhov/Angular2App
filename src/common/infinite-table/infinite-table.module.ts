import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {InfiniteTableComponent} from './infinite-table.component';

@NgModule({
  imports: [CommonModule],
  declarations: [InfiniteTableComponent],
  exports: [InfiniteTableComponent]
})

export class InfiniteTableModule {}

