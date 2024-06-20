import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';

export interface ResultWithFilterableFields {
    title: string;
    filterableFields: Record<string, string | number>;
}

export interface FilterCategory {
    title: string;
    value: string;
    filters: ReadonlyArray<FilterOption>;
}

export interface FilterCategoryForm {
    title: FormControl<string>;
    filters: FormArray<FormGroup<FilterOptionForm>>;
}

export interface FilterOption {
    title: string;
    value: string | number;
    count: number;
    checked: boolean;
}

type FilterOptionForm = {
    [field in keyof FilterOption]: FormControl<FilterOption[field]>;
};

export interface SelectedFilters<AVAILABLE_FILTER_CATEGORY = string> {
    category: AVAILABLE_FILTER_CATEGORY;
    selection: ReadonlyArray<string | number>;
}

@Component({
    selector: 'coal-filter-bar',
    templateUrl: './filter-bar.component.html',
    styleUrls: ['./filter-bar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterBarComponent implements OnDestroy {
    private valueChangesCategoriesSubscriptions: Array<Subscription> = [];
    private _resultsWithFilterableFields: ReadonlyArray<ResultWithFilterableFields> = [];

    public filterForm: FormGroup<{categories: FormArray<FormGroup<FilterCategoryForm>>}>;
    public currentSelection: ReadonlyArray<SelectedFilters> = [];
    public lastCategorySelected: string;

    @Input()
    public set resultsWithFilterableFields(value: ReadonlyArray<ResultWithFilterableFields>) {
        if (value && this._resultsWithFilterableFields.length === 0) {
            this._resultsWithFilterableFields = value;
            this.initializeForm();
        }
    }

    @Output()
    public filtersSelection = new EventEmitter<ReadonlyArray<SelectedFilters>>();

    public get categoriesFormArray(): FormArray<FormGroup<FilterCategoryForm>> {
        return (this.filterForm?.get('categories') as FormArray) ?? null;
    }

    public getFiltersFormArray(categoryIndex: number): FormArray {
        return this.categoriesFormArray.at(categoryIndex).get('filters') as FormArray;
    }

    public constructor(private fb: FormBuilder) {}

    public ngOnDestroy(): void {
        this.unsubscribeFromFormChanges();
    }

    public onChange(): void {
        this.currentSelection = this.filterForm.getRawValue().categories.reduce<ReadonlyArray<SelectedFilters>>((acc, currentFilterCategory) => {
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

        this.filtersSelection.emit(this.currentSelection);

        this.refreshForm();
    }

    public trackByIndex(index: number): number {
        return index;
    }

    private initializeForm(): void {
        this.filterForm = this.fb.group({
            categories: this.fb.array(this.buildFilterCategories().map((category) => this.createCategoryGroup(category))),
        });

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
        if (this.currentSelection.length) {
            const filteredResults = results.filter((result) => {
                return this.currentSelection.every((filter) => {
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
        return [...new Set(...results.map((result) => Object.keys(result.filterableFields)))];
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
                    const isChecked = this.currentSelection.find(
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
                filterCategory.valueChanges.subscribe(() => {
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
}
