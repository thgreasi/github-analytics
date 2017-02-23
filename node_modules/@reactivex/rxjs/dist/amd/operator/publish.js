define(["require", "exports", '../Subject', './multicast'], function (require, exports, Subject_1, multicast_1) {
    "use strict";
    /**
     * Returns a ConnectableObservable, which is a variety of Observable that waits until its connect method is called
     * before it begins emitting items to those Observers that have subscribed to it.
     *
     * <img src="./img/publish.png" width="100%">
     *
     * @return a ConnectableObservable that upon connection causes the source Observable to emit items to its Observers.
     * @method publish
     * @owner Observable
     */
    function publish() {
        return multicast_1.multicast.call(this, new Subject_1.Subject());
    }
    exports.publish = publish;
});
//# sourceMappingURL=publish.js.map