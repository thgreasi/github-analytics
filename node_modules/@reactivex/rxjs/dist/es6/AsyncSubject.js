import { Subject } from './Subject';
/**
 * @class AsyncSubject<T>
 */
export class AsyncSubject extends Subject {
    constructor(...args) {
        super(...args);
        this.value = null;
        this.hasNext = false;
    }
    _subscribe(subscriber) {
        if (this.hasCompleted && this.hasNext) {
            subscriber.next(this.value);
        }
        return super._subscribe(subscriber);
    }
    _next(value) {
        this.value = value;
        this.hasNext = true;
    }
    _complete() {
        let index = -1;
        const observers = this.observers;
        const len = observers.length;
        // optimization to block our SubjectSubscriptions from
        // splicing themselves out of the observers list one by one.
        this.isUnsubscribed = true;
        if (this.hasNext) {
            while (++index < len) {
                let o = observers[index];
                o.next(this.value);
                o.complete();
            }
        }
        else {
            while (++index < len) {
                observers[index].complete();
            }
        }
        this.isUnsubscribed = false;
        this.unsubscribe();
    }
}
//# sourceMappingURL=AsyncSubject.js.map