define(["require", "exports", './Rx', './observable/dom/AjaxObservable', './scheduler/asap', './scheduler/async', './scheduler/queue', './scheduler/animationFrame', './add/observable/dom/ajax', './add/observable/dom/webSocket'], function (require, exports, Rx_1, AjaxObservable_1, asap_1, async_1, queue_1, animationFrame_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    __export(Rx_1);
    exports.AjaxResponse = AjaxObservable_1.AjaxResponse;
    exports.AjaxError = AjaxObservable_1.AjaxError;
    exports.AjaxTimeoutError = AjaxObservable_1.AjaxTimeoutError;
    /* tslint:enable:no-unused-variable */
    exports.Scheduler = {
        asap: asap_1.asap,
        async: async_1.async,
        queue: queue_1.queue,
        animationFrame: animationFrame_1.animationFrame
    };
});
//# sourceMappingURL=Rx.DOM.js.map