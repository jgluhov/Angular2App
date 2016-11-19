import {
  Component,
  QueryList,
  ContentChildren,
  AfterViewInit
} from '@angular/core';

import {TabComponent} from './tab.component';

@Component({
  selector: 'tabs',
  template: `
    <div>     
      <ul class="nav nav-tabs" role="tablist">
        <li role="presentation" 
          *ngFor="let tab of tabs" 
          [class.active]="isSelectedTab(tab)">
          <a [href]="tab.href" 
            [attr.aria-controls]="tab.name"
            [attr.aria-expanded]="isSelectedTab(tab)"
            (click)="onSelect(tab)"
            role="tab" 
            data-toggle="tab">
            {{tab.title}}
          </a>          
        </li>        
      </ul>

      <div class="tab-content">       
        <div role="tabpanel" 
          class="tab-pane"
          *ngFor="let tab of tabs"
          [id]="tab.id"
          [class.active]="isSelectedTab(tab)">
          <template [tab]="tab"></template>
        </div>
      </div>
    </div>
  `
})

export class TabsComponent implements AfterViewInit {
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;

  private selectedTab: TabComponent;

  ngAfterViewInit() {
    this.selectedTab = this.tabs.first;
  }

  onSelect(tab: TabComponent) {
    this.selectedTab = tab;
  }

  isSelectedTab(tab: TabComponent) {
    return tab === this.selectedTab;
  }
}


