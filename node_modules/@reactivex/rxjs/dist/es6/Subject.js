import { Observable } from './Observable';
import { Subscriber } from './Subscriber';
import { Subscription } from './Subscription';
import { SubjectSubscription } from './SubjectSubscription';
import { $$rxSubscriber } from './symbol/rxSubscriber';
import { throwError } from './util/throwError';
import { ObjectUnsubscribedError } from './util/ObjectUnsubscribedError';
/**
 * @class Subject<T>
 */
export class Subject extends Observable {
    constructor(destination, source) {
        super();
        this.destination = destination;
        this.source = source;
        this.observers = [];
        this.isUnsubscribed = false;
        this.isStopped = false;
        this.hasErrored = false;
        this.dispatching = false;
        this.hasCompleted = false;
        this.source = source;
    }
    lift(operator) {
        const subject = new Subject(this.destination || this, this);
        subject.operator = operator;
        return subject;
    }
    add(subscription) {
        return Subscription.prototype.add.call(this, subscription);
    }
    remove(subscription) {
        Subscription.prototype.remove.call(this, subscription);
    }
    unsubscribe() {
        Subscription.prototype.unsubscribe.call(this);
    }
    _subscribe(subscriber) {
        if (this.source) {
            return this.source.subscribe(subscriber);
        }
        else {
            if (subscriber.isUnsubscribed) {
                return;
            }
            else if (this.hasErrored) {
                return subscriber.error(this.errorValue);
            }
            else if (this.hasCompleted) {
                return subscriber.complete();
            }
            this.throwIfUnsubscribed();
            const subscription = new SubjectSubscription(this, subscriber);
            this.observers.push(subscriber);
            return subscription;
        }
    }
    _unsubscribe() {
        this.source = null;
        this.isStopped = true;
        this.observers = null;
        this.destination = null;
    }
    next(value) {
        this.throwIfUnsubscribed();
        if (this.isStopped) {
            return;
        }
        this.dispatching = true;
        this._next(value);
        this.dispatching = false;
        if (this.hasErrored) {
            this._error(this.errorValue);
        }
        else if (this.hasCompleted) {
            this._complete();
        }
    }
    error(err) {
        this.throwIfUnsubscribed();
        if (this.isStopped) {
            return;
        }
        this.isStopped = true;
        this.hasErrored = true;
        this.errorValue = err;
        if (this.dispatching) {
            return;
        }
        this._error(err);
    }
    complete() {
        this.throwIfUnsubscribed();
        if (this.isStopped) {
            return;
        }
        this.isStopped = true;
        this.hasCompleted = true;
        if (this.dispatching) {
            return;
        }
        this._complete();
    }
    asObservable() {
        const observable = new SubjectObservable(this);
        return observable;
    }
    _next(value) {
        if (this.destination) {
            this.destination.next(value);
        }
        else {
            this._finalNext(value);
        }
    }
    _finalNext(value) {
        let index = -1;
        const observers = this.observers.slice(0);
        const len = observers.length;
        while (++index < len) {
            observers[index].next(value);
        }
    }
    _error(err) {
        if (this.destination) {
            this.destination.error(err);
        }
        else {
            this._finalError(err);
        }
    }
    _finalError(err) {
        let index = -1;
        const observers = this.observers;
        // optimization to block our SubjectSubscriptions from
        // splicing themselves out of the observers list one by one.
        this.observers = null;
        this.isUnsubscribed = true;
        if (observers) {
            const len = observers.length;
            while (++index < len) {
                observers[index].error(err);
            }
        }
        this.isUnsubscribed = false;
        this.unsubscribe();
    }
    _complete() {
        if (this.destination) {
            this.destination.complete();
        }
        else {
            this._finalComplete();
        }
    }
    _finalComplete() {
        let index = -1;
        const observers = this.observers;
        // optimization to block our SubjectSubscriptions from
        // splicing themselves out of the observers list one by one.
        this.observers = null;
        this.isUnsubscribed = true;
        if (observers) {
            const len = observers.length;
            while (++index < len) {
                observers[index].complete();
            }
        }
        this.isUnsubscribed = false;
        this.unsubscribe();
    }
    throwIfUnsubscribed() {
        if (this.isUnsubscribed) {
            throwError(new ObjectUnsubscribedError());
        }
    }
    [$$rxSubscriber]() {
        return new Subscriber(this);
    }
}
Subject.create = (destination, source) => {
    return new Subject(destination, source);
};
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class SubjectObservable extends Observable {
    constructor(source) {
        super();
        this.source = source;
    }
}
//# sourceMappingURL=Subject.js.map