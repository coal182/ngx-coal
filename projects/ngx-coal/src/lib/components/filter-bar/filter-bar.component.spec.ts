import {Component} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';

import {FilterBarComponent, FilterCategory} from './filter-bar.component';

import {MaterialModule} from '../../shared/material.module';

describe(FilterBarComponent.name, () => {
    let fixture: ComponentFixture<HostTestComponent>;
    let component: HostTestComponent;
    let filterBarComponent: FilterBarComponent;

    beforeEach(initTestingModule);

    it('should create', () => {
        expect(filterBarComponent).toBeTruthy();
    });

    it('should render checkboxes per each filter', () => {
        expect(fixture.debugElement.queryAll(By.css('.filter-checkbox')).length).toBe(4);
    });

    it('should render category titles', () => {
        const filterTitles = fixture.debugElement.queryAll(By.css('.filter-title'));
        expect(filterTitles.length).toBe(2);
        expect(filterTitles[0].nativeElement.textContent).toContain('Brand');
        expect(filterTitles[1].nativeElement.textContent).toContain('Category');
    });

    describe('when click on a filter', () => {
        beforeEach(() => clickOnFilter(0));

        it('should update form when selecting filters', () => {
            expect(filterBarComponent.filterForm.value).toEqual({
                categories: [
                    {
                        title: 'Brand',
                        filters: [
                            {title: 'Toyota', value: 'toyota', checked: true},
                            {title: 'Nissan', value: 'nissan', checked: false},
                        ],
                    },
                    {
                        title: 'Category',
                        filters: [
                            {title: 'SUV', value: 'suv', checked: false},
                            {title: 'Coupe', value: 'coupe', checked: false},
                        ],
                    },
                ],
            });
        });

        it('should emit the selection', () => {
            expect(component.onFilterSelection).toHaveBeenCalledWith([{category: 'Brand', selection: ['toyota']}]);
        });

        describe('and click on another filter', () => {
            beforeEach(() => clickOnFilter(2));

            it('should update form when selecting filters', () => {
                expect(filterBarComponent.filterForm.value).toEqual({
                    categories: [
                        {
                            title: 'Brand',
                            filters: [
                                {title: 'Toyota', value: 'toyota', checked: true},
                                {title: 'Nissan', value: 'nissan', checked: false},
                            ],
                        },
                        {
                            title: 'Category',
                            filters: [
                                {title: 'SUV', value: 'suv', checked: true},
                                {title: 'Coupe', value: 'coupe', checked: false},
                            ],
                        },
                    ],
                });
            });

            it('should emit the selection with both filters', () => {
                expect(component.onFilterSelection).toHaveBeenCalledTimes(2);
                expect(component.onFilterSelection).toHaveBeenCalledWith([
                    {category: 'Brand', selection: ['toyota']},
                    {category: 'Category', selection: ['suv']},
                ]);
            });

            describe('and deselect the first filter', () => {
                beforeEach(() => clickOnFilter(0));

                it('should update form when deselecting filters', () => {
                    expect(filterBarComponent.filterForm.value).toEqual({
                        categories: [
                            {
                                title: 'Brand',
                                filters: [
                                    {title: 'Toyota', value: 'toyota', checked: false},
                                    {title: 'Nissan', value: 'nissan', checked: false},
                                ],
                            },
                            {
                                title: 'Category',
                                filters: [
                                    {title: 'SUV', value: 'suv', checked: true},
                                    {title: 'Coupe', value: 'coupe', checked: false},
                                ],
                            },
                        ],
                    });
                });

                it('should emit the selection with only the last selected filter', () => {
                    expect(component.onFilterSelection).toHaveBeenCalledTimes(3);
                    expect(component.onFilterSelection).toHaveBeenCalledWith([{category: 'Category', selection: ['suv']}]);
                });
            });
        });
    });

    function clickOnFilter(index: number): void {
        fixture.debugElement.queryAll(By.css('input[type=checkbox]'))[index].nativeElement.click();
    }

    function initTestingModule(): void {
        TestBed.configureTestingModule({
            declarations: [FilterBarComponent, HostTestComponent],
            imports: [MaterialModule, ReactiveFormsModule],
        }).compileComponents();

        fixture = TestBed.createComponent(HostTestComponent);
        component = fixture.componentInstance;
        filterBarComponent = fixture.debugElement.query(By.directive(FilterBarComponent)).componentInstance;
        fixture.detectChanges();
    }

    @Component({
        template: '<coal-filter-bar [filterCategories]="filterCategories" (filtersSelection)="onFilterSelection($event)"></coal-filter-bar>',
    })
    class HostTestComponent {
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
                ],
            },
        ];
        public onFilterSelection = jasmine.createSpy();
    }
});
