import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {CardComponent} from './components/card/card.component';
import {FilterBarComponent} from './components/filter-bar/filter-bar.component';
import {RangeSelectorComponent} from './components/range-selector/range-selector.component';
import {StarRatingComponent} from './components/star-rating/star-rating.component';
import {MaterialModule} from './shared/material.module';

@NgModule({
    declarations: [StarRatingComponent, CardComponent, FilterBarComponent, RangeSelectorComponent],
    imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule],
    exports: [StarRatingComponent, CardComponent, FilterBarComponent, RangeSelectorComponent, MaterialModule],
})
export class NgxCoalModule {}
