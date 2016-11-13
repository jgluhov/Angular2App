import {NgModule} from '@angular/core';
import {NavbarComponent} from './navbar.component';
import {DropdownComponent} from './components/dropdown.component';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {NavbarService} from './navbar.service';


@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [NavbarComponent, DropdownComponent],
  exports: [NavbarComponent],
  providers: [NavbarService]
})

export class NavbarModule {
}
