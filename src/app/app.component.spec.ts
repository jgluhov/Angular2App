import {TestBed, async} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {RouterModule} from '@angular/router';
import appRoutes from './app.routes';

describe('AppComponent', () => {
    let fixture: any;
    let comp: any;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterModule, appRoutes],
            declarations: [AppComponent]
        })
        .compileComponents().then(() => {
            fixture = TestBed.createComponent(AppComponent);
            comp = fixture.componentInstance;
        });
    }));

    // it('should #create AppComponent', () => {
    //     expect(comp instanceof AppComponent).toBe(true, '#create AppComponent');
    // });
});
