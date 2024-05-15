import {NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDividerModule} from '@angular/material/divider';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSelectModule} from '@angular/material/select';
import {MatToolbarModule} from '@angular/material/toolbar';

@NgModule({
    imports: [
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatCardModule,
        MatProgressBarModule,
        MatDividerModule,
        MatSelectModule,
        MatInputModule,
        MatCheckboxModule,
    ],
    exports: [
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatCardModule,
        MatProgressBarModule,
        MatDividerModule,
        MatSelectModule,
        MatInputModule,
        MatToolbarModule,
        MatCheckboxModule,
    ],
})
export class MaterialModule {}
