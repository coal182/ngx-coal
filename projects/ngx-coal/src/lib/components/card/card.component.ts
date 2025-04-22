import {CommonModule} from '@angular/common';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BehaviorSubject, delayWhen, interval, map, of, pairwise, startWith} from 'rxjs';

import {MaterialModule} from '../../shared/material.module';

export enum CardStatus {
    Idle = 'iddle',
    Invalid = 'invalid',
    Saving = 'saving',
    Succeeded = 'succeeded',
    Failed = 'failed',
}

@Component({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule],
    selector: 'coal-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
    @Output()
    public cardSave: EventEmitter<void> = new EventEmitter();
    @Output()
    public cardReset: EventEmitter<void> = new EventEmitter();

    @Input()
    public showButtons = false;
    @Input()
    public cardStatus: BehaviorSubject<CardStatus>;

    public status: CardStatus = CardStatus.Idle;

    ngOnInit(): void {
        this.cardStatus
            .pipe(
                startWith(CardStatus.Idle),
                pairwise(),
                delayWhen(([previousStatus]) =>
                    previousStatus === CardStatus.Succeeded || previousStatus === CardStatus.Failed ? interval(2000) : of(undefined),
                ),
                map(([, currentStatus]) => currentStatus),
            )
            .subscribe((currentStatus) => (this.status = currentStatus));
    }

    public save(): void {
        this.cardSave.emit();
    }
    public reset(): void {
        this.cardReset.emit();
    }
}
