import { Subscriber } from '../Subscriber';
import { $$rxSubscriber } from '../symbol/rxSubscriber';
export function toSubscriber(nextOrObserver, error, complete) {
    if (nextOrObserver && typeof nextOrObserver === 'object') {
        if (nextOrObserver instanceof Subscriber) {
            return nextOrObserver;
        }
        else if (typeof nextOrObserver[$$rxSubscriber] === 'function') {
            return nextOrObserver[$$rxSubscriber]();
        }
    }
    return new Subscriber(nextOrObserver, error, complete);
}
//# sourceMappingURL=toSubscriber.js.map