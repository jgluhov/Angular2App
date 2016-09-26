import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsComponent} from './forms.component';
import FormsRoutes from './forms.routes';

@NgModule({
    imports: [CommonModule, FormsRoutes],
    declarations: [FormsComponent]
})

export class FormsModule {}
