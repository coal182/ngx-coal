import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CardStatus} from 'projects/ngx-coal/src/lib/components/card/card.component';
import {BehaviorSubject} from 'rxjs';

@Component({
    templateUrl: 'card-page.component.html',
    styleUrls: ['card-page.component.scss'],
    standalone: false
})
export class CardPageComponent {
    public status$ = new BehaviorSubject<CardStatus>(CardStatus.Idle);

    public myForm: FormGroup;
    public genders = [
        {title: 'Male', value: 'male'},
        {title: 'Female', value: 'female'},
    ];

    constructor(private fb: FormBuilder) {
        this.myForm = this.fb.group({
            name: ['', [Validators.required]],
            age: ['', [Validators.required]],
            gender: ['', [Validators.required]],
        });

        this.myForm.valueChanges.subscribe(() => {
            if (this.myForm.invalid) {
                this.status$.next(CardStatus.Invalid);
            } else {
                this.status$.next(CardStatus.Idle);
            }
        });
    }

    public async onSave(): Promise<void> {
        this.status$.next(CardStatus.Saving);

        await new Promise((resolve) => {
            setTimeout(resolve, 2000);
        });

        this.status$.next(CardStatus.Succeeded);
        //this.status$.next(CardStatus.Failed);

        this.status$.next(CardStatus.Idle);
    }
    public onReset(): void {
        this.myForm.reset();
    }
}
