import {
  Component,
  QueryList,
  OnInit,
  ContentChildren
} from '@angular/core';

import {TabComponent} from './tab.component';

@Component({
  selector: 'tabs',
  template: `
    <div>     
      <ul class="nav nav-tabs" role="tablist">
        <li role="presentation" *ngFor="let tab of tabs">
          <a href="#home" aria-controls="home" role="tab" data-toggle="tab">Home</a>
        </li>
        <!--<li role="presentation">-->
          <!--<a href="#profile" aria-controls="profile" role="tab" data-toggle="tab">Profile</a>-->
        <!--</li>-->
        <!--<li role="presentation">-->
          <!--<a href="#messages" aria-controls="messages" role="tab" data-toggle="tab">Messages</a>-->
        <!--</li>-->
        <!--<li role="presentation">-->
          <!--<a href="#settings" aria-controls="settings" role="tab" data-toggle="tab">Settings</a>-->
        <!--</li>-->
      </ul>

      <div class="tab-content">       
        <div role="tabpanel" class="tab-pane active" id="home" *ngFor="let tab of tabs">
          <template [tab]="tab"></template>
        </div>               
      </div>
    </div>
  `
})

export class TabsComponent implements OnInit {
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;

  ngOnInit() {
    // console.log(this);
  }
}


