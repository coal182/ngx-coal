import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import {MatListModule} from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {RouterModule, RouterOutlet} from '@angular/router';
import {MaterialModule} from 'projects/ngx-coal/src/public-api';

interface NavElement {
    title: string;
    route: string;
}

@Component({
    imports: [RouterModule, RouterOutlet, MaterialModule, MatSidenavModule, MatListModule],
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
        {
            title: 'Card',
            route: 'card',
        },
        {
            title: 'Filter Bar',
            route: 'filter-bar',
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
