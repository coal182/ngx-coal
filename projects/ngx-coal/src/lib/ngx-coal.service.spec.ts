import {TestBed} from '@angular/core/testing';

import {NgxCoalService} from './ngx-coal.service';

describe('NgxCoalService', () => {
    let service: NgxCoalService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(NgxCoalService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
