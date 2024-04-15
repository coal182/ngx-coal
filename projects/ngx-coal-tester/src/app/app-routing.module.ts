import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { StarRatingPageComponent } from './pages/star-rating/star-rating-page.component';

const routes: Routes = [
  { path: 'star-rating', component: StarRatingPageComponent },
];

@NgModule({
  imports: [BrowserModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
