import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatListModule} from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CardPageComponent} from './pages/card/card-page.component';
import {FilterBarPageComponent} from './pages/filter-bar/filter-bar-page.component';
import {StarRatingPageComponent} from './pages/star-rating/star-rating-page.component';

import {NgxCoalModule} from '../../../../projects/ngx-coal/src/public-api';

@NgModule({
    declarations: [AppComponent, StarRatingPageComponent, CardPageComponent, FilterBarPageComponent],
    imports: [BrowserModule, ReactiveFormsModule, NgxCoalModule, BrowserAnimationsModule, MatSidenavModule, MatListModule, AppRoutingModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
