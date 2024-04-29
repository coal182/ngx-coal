import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NgxCoalComponent} from './ngx-coal.component';

describe('NgxCoalComponent', () => {
    let component: NgxCoalComponent;
    let fixture: ComponentFixture<NgxCoalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [NgxCoalComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(NgxCoalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
