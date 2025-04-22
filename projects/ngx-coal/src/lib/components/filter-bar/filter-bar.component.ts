import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription, takeUntil} from 'rxjs';

import {DestroyNotificatorSubject} from '../../shared/utils';
import {NumberRange} from '../range-selector/range-selector.component';

export interface ResultWithFilterableFields {
    title: string;
    filterableFields: Record<string, string | number>;
}

type FilterForm = FormGroup<{categories: FormArray<FormGroup<FilterCategoryForm>>; price?: FormControl<FilterRange>}>;

interface FilterCategory {
    title: string;
    value: string;
    filters: ReadonlyArray<FilterOption>;
}

interface FilterCategoryForm {
    title: FormControl<string>;
    filters: FormArray<FormGroup<FilterOptionForm>>;
}

interface FilterOption {
    title: string;
    value: string | number;
    count: number;
    checked: boolean;
}

type FilterOptionForm = {
    [field in keyof FilterOption]: FormControl<FilterOption[field]>;
};

interface FilterRange {
    from: number;
    to: number;
}

interface SelectedFilters {
    category: string;
    selection: ReadonlyArray<string | number>;
}

type SelectedPrice = NumberRange;

export interface Selection {
    categories: ReadonlyArray<SelectedFilters>;
    price?: SelectedPrice | null;
}

@Component({
    selector: 'coal-filter-bar',
    templateUrl: './filter-bar.component.html',
    styleUrls: ['./filter-bar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class FilterBarComponent implements OnDestroy {
    private valueChangesCategoriesSubscriptions: Array<Subscription> = [];
    private _resultsWithFilterableFields: ReadonlyArray<ResultWithFilterableFields> = [];
    private onDestroy$ = new DestroyNotificatorSubject();
    public filterForm: FilterForm;
    public currentSelection: Selection = {categories: [], price: null};
    public priceStep = 500;

    @Input()
    public set resultsWithFilterableFields(value: ReadonlyArray<ResultWithFilterableFields>) {
        if (value && this._resultsWithFilterableFields.length === 0) {
            this._resultsWithFilterableFields = value;
            this.initializeForm();
        }
    }

    @Output()
    public filtersSelection = new EventEmitter<Selection>();

    public get categoriesFormArray(): FormArray<FormGroup<FilterCategoryForm>> {
        return (this.filterForm?.get('categories') as FormArray) ?? null;
    }

    public getFiltersFormArray(categoryIndex: number): FormArray {
        return this.categoriesFormArray.at(categoryIndex).get('filters') as FormArray;
    }

    public constructor(private fb: FormBuilder) {}

    public ngOnDestroy(): void {
        this.onDestroy$.notify();
    }

    public onChange(): void {
        const price = this.filterForm.controls.price?.valid ? this.filterForm.controls.price.value : null;

        this.currentSelection = {
            categories: this.getCategoriesSelection(),
            ...(price && {price}),
        };

        this.filtersSelection.emit(this.currentSelection);

        this.refreshForm();
    }

    public trackByIndex(index: number): number {
        return index;
    }

    private initializeForm(): void {
        this.filterForm = this.fb.group({
            categories: this.fb.array(this.buildFilterCategories().map((category) => this.createCategoryGroup(category))),
            ...(this.isPriceInFilters() && {
                price: new FormControl(this.buildPriceFilter(), {nonNullable: true, validators: [Validators.min(0), Validators.max(1000)]}),
            }),
        });

        if (this.isPriceInFilters()) {
            this.filterForm.controls.price!.valueChanges.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
                this.onChange();
            });
        }

        this.subscribeToFormChanges();
    }

    private refreshForm(): void {
        this.unsubscribeFromFormChanges();
        const categoriesArray = this.buildFilterCategories().map((category) => this.createCategoryGroup(category));
        (this.filterForm as FormGroup).removeControl('categories');
        this.filterForm.addControl('categories', this.fb.array(categoriesArray));
        this.subscribeToFormChanges();
    }

    private filterResultsPerCategory(results: ReadonlyArray<ResultWithFilterableFields>, category: string): ReadonlyArray<ResultWithFilterableFields> {
        const selectedCategories = this.currentSelection.categories;
        if (selectedCategories.length) {
            const filteredResults = results.filter((result) => {
                return selectedCategories.every((filter) => {
                    return (
                        filter.category === category ||
                        !filter.selection.length ||
                        filter.selection.includes(result.filterableFields[filter.category as keyof ResultWithFilterableFields])
                    );
                });
            });
            return filteredResults;
        }
        return results;
    }

    private getFilterableFields(results: ReadonlyArray<ResultWithFilterableFields>): ReadonlyArray<string> {
        return [...new Set(...results.map((result) => Object.keys(result.filterableFields)))].filter((field) => field !== 'price');
    }

    private buildPriceFilter(): NumberRange {
        const prices: ReadonlyArray<number> = this._resultsWithFilterableFields.map((result) => result.filterableFields['price'] as number);

        return {from: Math.min(...prices), to: Math.max(...prices)};
    }

    private buildFilterCategories(): ReadonlyArray<FilterCategory> {
        return this.getFilterableFields(this._resultsWithFilterableFields).reduce<ReadonlyArray<FilterCategory>>((categories, availableCategory) => {
            return [
                ...categories,
                {
                    title: availableCategory,
                    value: availableCategory,
                    filters: this.buildFiltersPerCategory(availableCategory, this._resultsWithFilterableFields),
                },
            ];
        }, []);
    }

    private buildFiltersPerCategory(filterCategory: string, results: ReadonlyArray<ResultWithFilterableFields>): ReadonlyArray<FilterOption> {
        const filterOptions: Map<string, FilterOption> = new Map();

        this.filterResultsPerCategory(results, filterCategory)
            .map((result) => result.filterableFields[filterCategory])
            .forEach((filterCategoryValue) => {
                const existingFilter = filterOptions.get(filterCategoryValue.toString());
                if (existingFilter) {
                    filterOptions.set(filterCategoryValue.toString(), {...existingFilter, count: existingFilter.count + 1});
                } else {
                    const isChecked = this.currentSelection.categories.find(
                        (selection) => selection.category === filterCategory && selection.selection.includes(filterCategoryValue),
                    );
                    filterOptions.set(filterCategoryValue.toString(), {
                        title: filterCategoryValue.toString(),
                        value: filterCategoryValue,
                        count: 1,
                        checked: !!isChecked,
                    });
                }
            });

        return Array.from(filterOptions.values()).sort((a, b) => b.count - a.count);
    }

    private createCategoryGroup(category: FilterCategory): FormGroup<FilterCategoryForm> {
        if (category.title === 'price') {
            return this.fb.group<FilterCategoryForm>({
                title: this.fb.control(category.title, {nonNullable: true}),
                filters: this.fb.array(category.filters.map((filter) => this.createFilterGroup(filter))),
            });
        }

        return this.fb.group<FilterCategoryForm>({
            title: this.fb.control(category.title, {nonNullable: true}),
            filters: this.fb.array(category.filters.map((filter) => this.createFilterGroup(filter))),
        });
    }

    private createFilterGroup(filter: FilterOption): FormGroup<FilterOptionForm> {
        return this.fb.group({
            title: this.fb.control(filter.title, {nonNullable: true}),
            value: this.fb.control(filter.value, {nonNullable: true}),
            count: this.fb.control(filter.count, {nonNullable: true}),
            checked: this.fb.control(filter.checked, {nonNullable: true}),
        });
    }

    private subscribeToFormChanges(): void {
        this.categoriesFormArray.controls.forEach((filterCategory) => {
            this.valueChangesCategoriesSubscriptions.push(
                filterCategory.valueChanges.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
                    this.onChange();
                }),
            );
        });
    }

    private unsubscribeFromFormChanges(): void {
        if (this.valueChangesCategoriesSubscriptions.length) {
            this.valueChangesCategoriesSubscriptions.forEach((categorySubscription) => {
                categorySubscription.unsubscribe();
            });
            this.valueChangesCategoriesSubscriptions = [];
        }
    }

    private getCategoriesSelection(): ReadonlyArray<SelectedFilters> {
        return this.filterForm.getRawValue().categories.reduce<ReadonlyArray<SelectedFilters>>((acc, currentFilterCategory) => {
            const checkedFilters = currentFilterCategory.filters.filter((filter) => filter.checked).map((filter) => filter.value);
            const selection: SelectedFilters = {
                category: currentFilterCategory.title,
                selection: checkedFilters,
            };
            if (checkedFilters.length) {
                return [...acc, selection];
            }
            return acc;
        }, []);
    }

    private isPriceInFilters(): boolean {
        return !!this._resultsWithFilterableFields[0].filterableFields['price'];
    }
}
