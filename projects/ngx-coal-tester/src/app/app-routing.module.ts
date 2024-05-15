import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {Routes, RouterModule} from '@angular/router';

import {CardPageComponent} from './pages/card/card-page.component';
import {FilterBarPageComponent} from './pages/filter-bar-page/filter-bar-page.component';
import {StarRatingPageComponent} from './pages/star-rating/star-rating-page.component';

const routes: Routes = [
    {path: 'star-rating', component: StarRatingPageComponent},
    {path: 'card', component: CardPageComponent},
    {path: 'filter-bar', component: FilterBarPageComponent},
];

@NgModule({
    imports: [BrowserModule, RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
