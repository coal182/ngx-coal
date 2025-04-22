import {Subject} from 'rxjs';

export type OnChangeFn<T> = (newValue: T) => void;
export type NoOp = () => void;
export function noop(): void {
    return;
}
export type Nullable<T> = {[K in keyof T]: T[K] | null};

export class DestroyNotificatorSubject extends Subject<void> {
    public notify(): void {
        this.next();
        this.complete();
    }
}
