import {Routes} from '@angular/router';

import {CardPageComponent} from './pages/card/card-page.component';
import {FilterBarPageComponent} from './pages/filter-bar/filter-bar-page.component';
import {StarRatingPageComponent} from './pages/star-rating/star-rating-page.component';

export const routes: Routes = [
    {path: 'star-rating', component: StarRatingPageComponent},
    {path: 'card', component: CardPageComponent},
    {path: 'filter-bar', component: FilterBarPageComponent},
];
