import { Subject } from './Subject';
import { throwError } from './util/throwError';
import { ObjectUnsubscribedError } from './util/ObjectUnsubscribedError';
/**
 * @class BehaviorSubject<T>
 */
export class BehaviorSubject extends Subject {
    constructor(_value) {
        super();
        this._value = _value;
    }
    getValue() {
        if (this.hasErrored) {
            throwError(this.errorValue);
        }
        else if (this.isUnsubscribed) {
            throwError(new ObjectUnsubscribedError());
        }
        else {
            return this._value;
        }
    }
    get value() {
        return this.getValue();
    }
    _subscribe(subscriber) {
        const subscription = super._subscribe(subscriber);
        if (subscription && !subscription.isUnsubscribed) {
            subscriber.next(this._value);
        }
        return subscription;
    }
    _next(value) {
        super._next(this._value = value);
    }
    _error(err) {
        this.hasErrored = true;
        super._error(this.errorValue = err);
    }
}
//# sourceMappingURL=BehaviorSubject.js.map