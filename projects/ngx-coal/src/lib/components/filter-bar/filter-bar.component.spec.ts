import {Component} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

import {FilterBarComponent, ResultWithFilterableFields} from './filter-bar.component';

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
        expect(filterTitles[0].nativeElement.textContent).toContain('brand');
        expect(filterTitles[1].nativeElement.textContent).toContain('category');
    });

    describe('when click on a filter', () => {
        beforeEach(() => clickOnFilter(0));

        it('should update form when selecting filters filtering the other category', () => {
            expect(filterBarComponent.filterForm.value).toEqual({
                categories: [
                    {
                        title: 'brand',
                        filters: [
                            {title: 'Toyota', value: 'Toyota', checked: true, count: 1},
                            {title: 'Nissan', value: 'Nissan', checked: false, count: 1},
                        ],
                    },
                    {
                        title: 'category',
                        filters: [{title: 'SUV', value: 'SUV', checked: false, count: 1}],
                    },
                ],
            });
        });

        it('should emit the selection', () => {
            expect(component.onFilterSelection).toHaveBeenCalledWith({categories: [{category: 'brand', selection: ['Toyota']}]});
        });

        describe('and click on another filter', () => {
            beforeEach(() => clickOnFilter(2));

            it('should update form when selecting filters filtering the other category', () => {
                expect(filterBarComponent.filterForm.value).toEqual({
                    categories: [
                        {
                            title: 'brand',
                            filters: [{title: 'Toyota', value: 'Toyota', checked: true, count: 1}],
                        },
                        {
                            title: 'category',
                            filters: [{title: 'SUV', value: 'SUV', checked: true, count: 1}],
                        },
                    ],
                });
            });

            it('should emit the selection with both filters', () => {
                expect(component.onFilterSelection).toHaveBeenCalledTimes(2);
                expect(component.onFilterSelection).toHaveBeenCalledWith({
                    categories: [
                        {category: 'brand', selection: ['Toyota']},
                        {category: 'category', selection: ['SUV']},
                    ],
                });
            });

            describe('and deselect the first filter', () => {
                beforeEach(() => clickOnFilter(0));

                it('should update form when deselecting filters', () => {
                    expect(filterBarComponent.filterForm.value).toEqual({
                        categories: [
                            {
                                title: 'brand',
                                filters: [{title: 'Toyota', value: 'Toyota', checked: false, count: 1}],
                            },
                            {
                                title: 'category',
                                filters: [
                                    {title: 'SUV', value: 'SUV', checked: true, count: 1},
                                    {title: 'Coupe', value: 'Coupe', checked: false, count: 1},
                                ],
                            },
                        ],
                    });
                });

                it('should emit the selection with only the last selected filter', () => {
                    expect(component.onFilterSelection).toHaveBeenCalledTimes(3);
                    expect(component.onFilterSelection).toHaveBeenCalledWith({categories: [{category: 'category', selection: ['SUV']}]});
                });
            });
        });
    });

    function clickOnFilter(index: number): void {
        fixture.debugElement.queryAll(By.css('input[type=checkbox]'))[index].nativeElement.click();
        fixture.detectChanges();
    }

    function initTestingModule(): void {
        TestBed.configureTestingModule({}).compileComponents();

        fixture = TestBed.createComponent(HostTestComponent);
        component = fixture.componentInstance;
        filterBarComponent = fixture.debugElement.query(By.directive(FilterBarComponent)).componentInstance;
        fixture.detectChanges();
    }

    @Component({
        imports: [FilterBarComponent],
        template: `<coal-filter-bar
            [resultsWithFilterableFields]="resultsWithFilterableFields"
            (filtersSelection)="onFilterSelection($event)"
        ></coal-filter-bar>`,
    })
    class HostTestComponent {
        public resultsWithFilterableFields: ReadonlyArray<ResultWithFilterableFields> = [
            {
                title: 'Toyota CHR',
                filterableFields: {
                    brand: 'Toyota',
                    category: 'SUV',
                },
            },
            {
                title: 'Nissan Skyline',
                filterableFields: {
                    brand: 'Nissan',
                    category: 'Coupe',
                },
            },
        ];
        public onFilterSelection = jasmine.createSpy();
    }
});
