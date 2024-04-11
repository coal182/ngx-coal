import { NgModule } from '@angular/core';
import { NgxCoalComponent } from './ngx-coal.component';
import { StarRatingComponent } from './components/star-rating/star-rating.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';



@NgModule({
  declarations: [
    NgxCoalComponent,
    StarRatingComponent
  ],
  imports: [
    MatIconModule, MatFormFieldModule
  ],
  exports: [
    NgxCoalComponent,
    StarRatingComponent
  ]
})
export class NgxCoalModule { }
