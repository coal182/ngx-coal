import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';

import {StarRatingComponent} from './components/star-rating/star-rating.component';

@NgModule({
    declarations: [StarRatingComponent],
    imports: [CommonModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatIconModule, MatFormFieldModule],
    exports: [StarRatingComponent],
})
export class NgxCoalModule {}
