define(["require", "exports", '../Subscriber', '../symbol/rxSubscriber'], function (require, exports, Subscriber_1, rxSubscriber_1) {
    "use strict";
    function toSubscriber(nextOrObserver, error, complete) {
        if (nextOrObserver && typeof nextOrObserver === 'object') {
            if (nextOrObserver instanceof Subscriber_1.Subscriber) {
                return nextOrObserver;
            }
            else if (typeof nextOrObserver[rxSubscriber_1.$$rxSubscriber] === 'function') {
                return nextOrObserver[rxSubscriber_1.$$rxSubscriber]();
            }
        }
        return new Subscriber_1.Subscriber(nextOrObserver, error, complete);
    }
    exports.toSubscriber = toSubscriber;
});
//# sourceMappingURL=toSubscriber.js.map