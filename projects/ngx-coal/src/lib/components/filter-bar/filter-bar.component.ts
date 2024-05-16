import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';

export interface FilterCategory {
    title: string;
    value: string | number;
    filters: ReadonlyArray<FilterOption>;
}

export interface FilterOption {
    title: string;
    value: string | number;
    checked: boolean;
}

export interface SelectedFilters {
    category: string | number;
    selection: ReadonlyArray<string | number>;
}

@Component({
    selector: 'coal-filter-bar',
    templateUrl: './filter-bar.component.html',
    styleUrls: ['./filter-bar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterBarComponent implements OnInit, OnDestroy {
    @Input()
    public filterCategories: ReadonlyArray<FilterCategory> = [];

    @Output()
    public filtersSelection = new EventEmitter<ReadonlyArray<SelectedFilters>>();

    public filterForm: FormGroup;

    private valueChangesSubscription: Subscription;

    public get categoriesFormArray(): FormArray {
        return this.filterForm.get('categories') as FormArray;
    }

    public getFiltersFormArray(categoryIndex: number): FormArray {
        return this.categoriesFormArray.at(categoryIndex).get('filters') as FormArray;
    }

    public constructor(private fb: FormBuilder) {}

    public ngOnInit(): void {
        this.initializeForm();
        this.subscribeToFormChanges();
    }

    public ngOnDestroy(): void {
        if (this.valueChangesSubscription) {
            this.valueChangesSubscription.unsubscribe();
        }
    }

    public onChange(): void {
        const currentSelections = this.filterForm.value.categories.reduce((acc: ReadonlyArray<SelectedFilters>, currentFilterCategory: FilterCategory) => {
            const checkedFilters = currentFilterCategory.filters.filter((filter) => filter.checked).map((filter) => filter.value);
            const selection: SelectedFilters = {category: currentFilterCategory.title, selection: checkedFilters};
            if (checkedFilters.length) {
                return [...acc, selection];
            }
            return acc;
        }, []);

        this.filtersSelection.emit(currentSelections);
    }

    public trackByIndex(index: number): number {
        return index;
    }

    private initializeForm(): void {
        this.filterForm = this.fb.group({
            categories: this.fb.array(this.filterCategories.map((category) => this.createCategoryGroup(category))),
        });
    }

    private createCategoryGroup(category: FilterCategory): FormGroup {
        return this.fb.group({
            title: category.title,
            filters: this.fb.array(category.filters.map((filter) => this.createFilterGroup(filter))),
        });
    }

    private createFilterGroup(filter: FilterOption): FormGroup {
        return this.fb.group({
            title: filter.title,
            value: filter.value,
            checked: filter.checked,
        });
    }

    private subscribeToFormChanges(): void {
        this.valueChangesSubscription = this.filterForm.valueChanges.subscribe(() => {
            this.onChange();
        });
    }
}
