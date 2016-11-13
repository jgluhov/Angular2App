import {Component, Input} from '@angular/core';
import animations from '../navbar.animations';
import {NavbarService} from '../navbar.service';

@Component({
  selector: '[dropdown]',
  animations: animations,
  templateUrl: './dropdown.component.html',
})

export class DropdownComponent {
  @Input() item: any;

  constructor(private navbarService: NavbarService) {}
}
