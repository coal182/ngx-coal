import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, Component, OnDestroy} from '@angular/core';

interface NavElement {
    title: string;
    route: string;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
    public title = 'ngx-coal-tester';
    public mobileQuery: MediaQueryList;
    public sidenavElements: ReadonlyArray<NavElement> = [
        {title: 'Home', route: ''},
        {
            title: 'Star Rating',
            route: 'star-rating',
        },
    ];

    private _mobileQueryListener: () => void;

    public constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
        this.mobileQuery = media.matchMedia('(max-width: 600px)');
        this._mobileQueryListener = (): void => changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    }

    public ngOnDestroy(): void {
        this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
    }
}
