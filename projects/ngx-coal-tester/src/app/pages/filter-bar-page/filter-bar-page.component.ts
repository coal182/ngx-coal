import {Component} from '@angular/core';
import {FilterSelection} from 'projects/ngx-coal/src/lib/components/filter-bar/filter-bar.component';

@Component({
    templateUrl: './filter-bar-page.component.html',
    styleUrls: ['./filter-bar-page.component.scss'],
})
export class FilterBarPageComponent {
    public selection: ReadonlyArray<FilterSelection> = [];

    public onFilterSelection(selection: ReadonlyArray<FilterSelection>): void {
        this.selection = selection;
    }
}
