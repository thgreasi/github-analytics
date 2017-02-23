define(["require", "exports", '../AsyncSubject', './multicast'], function (require, exports, AsyncSubject_1, multicast_1) {
    "use strict";
    /**
     * @return {ConnectableObservable<T>}
     * @method publishLast
     * @owner Observable
     */
    function publishLast() {
        return multicast_1.multicast.call(this, new AsyncSubject_1.AsyncSubject());
    }
    exports.publishLast = publishLast;
});
//# sourceMappingURL=publishLast.js.map