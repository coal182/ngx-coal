import { HttpClient } from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {ResultWithFilterableFields, Selection} from 'projects/ngx-coal/src/lib/components/filter-bar/filter-bar.component';
import {BehaviorSubject, map, tap} from 'rxjs';

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
    standalone: false
})
export class FilterBarPageComponent implements OnInit {
    public displayedCars$: BehaviorSubject<ReadonlyArray<Car>>;
    public resultsWithFilterableFields: ReadonlyArray<ResultWithFilterableFields>;
    public selection: Selection = {categories: [], price: null};

    public constructor(private httpClient: HttpClient) {}

    public ngOnInit(): void {
        this.displayedCars$ = new BehaviorSubject<ReadonlyArray<Car>>([]);
        this.getCars();
    }
    public onFilterSelection(selectedFilters: Selection): void {
        this.selection = selectedFilters;
        this.getCars(selectedFilters);
    }

    private getCars(filters: Selection = this.selection): void {
        this.httpClient
            .get<ReadonlyArray<Car>>('/assets/cars.json')
            .pipe(
                map((cars) => this.filterCars(cars, filters)),
                tap((filteredCars) => this.buildResultsWithFilterableFields(filteredCars)),
            )
            .subscribe((filteredCars) => this.displayedCars$.next(filteredCars));
    }

    private buildResultsWithFilterableFields(cars: ReadonlyArray<Car>): void {
        this.resultsWithFilterableFields = cars.map((car) => ({
            title: car.car,
            filterableFields: AVAILABLE_FILTER_CATEGORIES.reduce((filterableFields, filterCategory) => {
                return {
                    ...filterableFields,
                    [filterCategory]: car[filterCategory],
                };
            }, {}),
        }));
    }

    private filterCars(cars: ReadonlyArray<Car>, filters: Selection): ReadonlyArray<Car> {
        const categories = filters.categories;
        let filteredCars = cars;
        if (categories.length) {
            filteredCars = cars.filter((car) => {
                return categories.every((filter) => {
                    return !filter.selection.length || filter.selection.includes(car[filter.category as keyof Car]);
                });
            });
        }

        if (filters.price) {
            const price = filters.price;
            if (price !== null) {
                filteredCars = filteredCars.filter((car) => car.price >= price.from && car.price <= price.to);
            }
        }
        return filteredCars;
    }
}
