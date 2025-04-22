import {JsonPipe} from '@angular/common';
import {Component} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {StarRatingComponent} from 'projects/ngx-coal/src/public-api';

@Component({
    imports: [StarRatingComponent, JsonPipe, FormsModule, ReactiveFormsModule],
    templateUrl: 'star-rating-page.component.html',
    styleUrls: ['star-rating-page.component.scss'],
})
export class StarRatingPageComponent {
    public rating: FormControl<number | null> = new FormControl<number>(0, [Validators.required]);
}
