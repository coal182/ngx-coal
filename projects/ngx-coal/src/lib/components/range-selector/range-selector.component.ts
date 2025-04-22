import {CommonModule} from '@angular/common';
import {Component, Input, forwardRef} from '@angular/core';
import {
    ControlValueAccessor,
    FormControl,
    FormGroup,
    FormsModule,
    NG_VALIDATORS,
    NG_VALUE_ACCESSOR,
    ReactiveFormsModule,
    ValidationErrors,
    Validator,
} from '@angular/forms';
import {debounceTime} from 'rxjs';

import {MaterialModule} from '../../shared/material.module';
import {Nullable, OnChangeFn, noop} from '../../shared/utils';

export interface NumberRange {
    from: number;
    to: number;
}

@Component({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule],
    selector: 'coal-range-selector',
    templateUrl: './range-selector.component.html',
    styleUrl: './range-selector.component.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => RangeSelectorComponent),
            multi: true,
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => RangeSelectorComponent),
            multi: true,
        },
    ],
})
export class RangeSelectorComponent implements ControlValueAccessor, Validator {
    private onChange: OnChangeFn<Partial<Nullable<NumberRange>>> = noop;

    public min: number;
    public max: number;

    @Input()
    public step: number = 1000;

    public rangeForm = new FormGroup({
        from: new FormControl(0),
        to: new FormControl(1000),
    });

    writeValue(value: NumberRange): void {
        if (!this.max && !this.min) {
            this.min = value.from;
            this.max = value.to;
        }
        this.rangeForm.patchValue(value);

        this.rangeForm.valueChanges.pipe(debounceTime(500)).subscribe((changes) => {
            this.onChange(changes);
        });
    }
    registerOnChange(fn: OnChangeFn<Partial<Nullable<NumberRange>>>): void {
        this.onChange = fn;
    }
    registerOnTouched(): void {
        return;
    }

    validate(): ValidationErrors | null {
        if (!this.rangeForm.value.from || !this.rangeForm.value.to) {
            return {someRangeElementUndefined: true};
        }
        if (this.rangeForm.value.from > this.rangeForm.value.to) {
            return {fromGreaterThanTo: true};
        }
        return null;
    }
}
