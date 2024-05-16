import {Component} from '@angular/core';
import {FilterCategory, SelectedFilters} from 'projects/ngx-coal/src/lib/components/filter-bar/filter-bar.component';

@Component({
    templateUrl: './filter-bar-page.component.html',
    styleUrls: ['./filter-bar-page.component.scss'],
})
export class FilterBarPageComponent {
    public filterCategories: ReadonlyArray<FilterCategory> = [
        {
            title: 'Brand',
            value: 'brand',
            filters: [
                {
                    title: 'Toyota',
                    value: 'toyota',
                    checked: false,
                },
                {
                    title: 'Nissan',
                    value: 'nissan',
                    checked: false,
                },
                {
                    title: 'Honda',
                    value: 'honda',
                    checked: false,
                },
                {
                    title: 'Subaru',
                    value: 'subaru',
                    checked: false,
                },
            ],
        },
        {
            title: 'Category',
            value: 'category',
            filters: [
                {
                    title: 'SUV',
                    value: 'suv',
                    checked: false,
                },
                {
                    title: 'Coupe',
                    value: 'coupe',
                    checked: false,
                },
                {
                    title: 'Sedan',
                    value: 'sedan',
                    checked: false,
                },
                {
                    title: 'Hatchback',
                    value: 'hatchback',
                    checked: false,
                },
            ],
        },
    ];
    public selection: ReadonlyArray<SelectedFilters> = [];

    public onFilterSelection(selection: ReadonlyArray<SelectedFilters>): void {
        this.selection = selection;
    }
}
