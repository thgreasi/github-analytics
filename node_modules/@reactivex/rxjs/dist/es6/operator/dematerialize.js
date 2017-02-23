import { Subscriber } from '../Subscriber';
/**
 * Returns an Observable that transforms Notification objects into the items or notifications they represent.
 *
 * @see {@link Notification}
 *
 * @return {Observable} an Observable that emits items and notifications embedded in Notification objects emitted by the source Observable.
 * @method dematerialize
 * @owner Observable
 */
export function dematerialize() {
    return this.lift(new DeMaterializeOperator());
}
class DeMaterializeOperator {
    call(subscriber, source) {
        return source._subscribe(new DeMaterializeSubscriber(subscriber));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class DeMaterializeSubscriber extends Subscriber {
    constructor(destination) {
        super(destination);
    }
    _next(value) {
        value.observe(this.destination);
    }
}
//# sourceMappingURL=dematerialize.js.map