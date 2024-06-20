import {HttpClient} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {ResultWithFilterableFields, SelectedFilters} from 'projects/ngx-coal/src/lib/components/filter-bar/filter-bar.component';
import {Observable, map, tap} from 'rxjs';

interface Car {
    car: string;
    brand: string;
    color: string;
    price: number;
    category: string;
}

const AVAILABLE_FILTER_CATEGORIES = ['brand', 'category', 'color', 'price'] as const;

@Component({
    templateUrl: './filter-bar-page.component.html',
    styleUrls: ['./filter-bar-page.component.scss'],
})
export class FilterBarPageComponent implements OnInit {
    public cars$: Observable<ReadonlyArray<Car>>;
    public resultsWithFilterableFields: ReadonlyArray<ResultWithFilterableFields>;
    public selection: ReadonlyArray<SelectedFilters> = [];

    public constructor(private httpClient: HttpClient) {}

    public ngOnInit(): void {
        this.getCars();
    }
    public onFilterSelection(selectedFilters: ReadonlyArray<SelectedFilters>): void {
        this.selection = selectedFilters;
        this.getCars(selectedFilters);
    }

    private getCars(filters: ReadonlyArray<SelectedFilters> = []): void {
        setTimeout(() => {
            this.cars$ = this.httpClient.get<ReadonlyArray<Car>>('/assets/cars.json').pipe(
                map((cars) => this.filterCars(cars, filters)),
                tap((cars) => this.buildResultsWithFilterableFields(cars)),
            );
        }, 100);
    }

    private buildResultsWithFilterableFields(cars: ReadonlyArray<Car>): void {
        this.resultsWithFilterableFields = cars.map((car) => ({
            title: car.car,
            filterableFields: {
                [AVAILABLE_FILTER_CATEGORIES[0]]: car[AVAILABLE_FILTER_CATEGORIES[0]],
                [AVAILABLE_FILTER_CATEGORIES[1]]: car[AVAILABLE_FILTER_CATEGORIES[1]],
                [AVAILABLE_FILTER_CATEGORIES[2]]: car[AVAILABLE_FILTER_CATEGORIES[2]],
                [AVAILABLE_FILTER_CATEGORIES[3]]: car[AVAILABLE_FILTER_CATEGORIES[3]],
            },
        }));
    }

    private filterCars(cars: ReadonlyArray<Car>, filters: ReadonlyArray<SelectedFilters>): ReadonlyArray<Car> {
        if (filters.length) {
            return cars.filter((car) => {
                return filters.every((filter) => {
                    return !filter.selection.length || filter.selection.includes(car[filter.category as keyof Car]);
                });
            });
        }
        return cars;
    }
}
