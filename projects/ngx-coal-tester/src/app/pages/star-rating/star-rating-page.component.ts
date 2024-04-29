import {Component} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

@Component({
    templateUrl: 'star-rating-page.component.html',
    styleUrls: ['star-rating-page.component.scss'],
})
export class StarRatingPageComponent {
    public rating: FormControl<number | null> = new FormControl<number>(0, [Validators.required]);
}
