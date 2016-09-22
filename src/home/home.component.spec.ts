import {TestBed, async} from '@angular/core/testing';
import {HomeComponent} from './home.component';

describe('HomeComponent', () => {
    let fixture: any;
    let comp: any;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [HomeComponent]
        })
        .compileComponents().then(() => {
            fixture = TestBed.createComponent(HomeComponent);
            comp = fixture.componentInstance
        });
    }));

    it('#create HomeComponent', () => {
        expect(fixture.componentInstance instanceof HomeComponent).toBe(true, 'should create HomeComponent');
    });
});