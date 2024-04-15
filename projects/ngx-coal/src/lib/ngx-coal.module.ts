import { NgModule } from '@angular/core';
import { NgxCoalComponent } from './ngx-coal.component';
import { StarRatingComponent } from './components/star-rating/star-rating.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [
    NgxCoalComponent,
    StarRatingComponent
  ],
  imports: [
    CommonModule, FormsModule, MatButtonModule, MatIconModule, MatFormFieldModule
  ],
  exports: [
    NgxCoalComponent,
    StarRatingComponent,
    MatIconModule, 
    MatFormFieldModule
  ]
})
export class NgxCoalModule { }
