import {Component, EventEmitter, Input, Output} from '@angular/core';

export interface FilterCategory {
    title: string;
    filters: ReadonlyArray<Filter>;
}

export interface Filter {
    title: string;
    value: string | number;
    checked: boolean;
}

export interface FilterSelection {
    title: string;
    selection: ReadonlyArray<string | number>;
}

@Component({
    selector: 'coal-filter-bar',
    templateUrl: './filter-bar.component.html',
    styleUrls: ['./filter-bar.component.scss'],
})
export class FilterBarComponent {
    @Input()
    public filters: ReadonlyArray<FilterCategory> = [
        {
            title: 'Brand',
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

    @Output()
    public filtersSelection = new EventEmitter<ReadonlyArray<FilterSelection>>();

    public onChange(): void {
        const selection = this.filters.reduce((acc: ReadonlyArray<FilterSelection>, cur: FilterCategory) => {
            const checkedFilters = cur.filters.filter((filter) => filter.checked).map((filter) => filter.value);
            const selection: FilterSelection = {title: cur.title, selection: checkedFilters};
            if (checkedFilters.length) {
                return [...acc, selection];
            }
            return acc;
        }, []);

        this.filtersSelection.emit(selection);
    }
}
