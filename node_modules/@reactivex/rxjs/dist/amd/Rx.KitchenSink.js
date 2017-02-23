define(["require", "exports", './Rx', './operator/timeInterval', './operator/timestamp', './testing/TestScheduler', './scheduler/VirtualTimeScheduler', './add/observable/if', './add/observable/using', './add/operator/distinct', './add/operator/distinctKey', './add/operator/distinctUntilKeyChanged', './add/operator/elementAt', './add/operator/exhaust', './add/operator/exhaustMap', './add/operator/find', './add/operator/findIndex', './add/operator/isEmpty', './add/operator/max', './add/operator/mergeScan', './add/operator/min', './add/operator/pairwise', './add/operator/timeInterval', './add/operator/timestamp'], function (require, exports, Rx_1, timeInterval_1, timestamp_1, TestScheduler_1, VirtualTimeScheduler_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    __export(Rx_1);
    exports.TimeInterval = timeInterval_1.TimeInterval;
    exports.Timestamp = timestamp_1.Timestamp;
    exports.TestScheduler = TestScheduler_1.TestScheduler;
    exports.VirtualTimeScheduler = VirtualTimeScheduler_1.VirtualTimeScheduler;
});
//# sourceMappingURL=Rx.KitchenSink.js.map