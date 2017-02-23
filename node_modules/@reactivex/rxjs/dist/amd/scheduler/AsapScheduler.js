var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", './AsapAction', './QueueScheduler'], function (require, exports, AsapAction_1, QueueScheduler_1) {
    "use strict";
    var AsapScheduler = (function (_super) {
        __extends(AsapScheduler, _super);
        function AsapScheduler() {
            _super.apply(this, arguments);
        }
        AsapScheduler.prototype.scheduleNow = function (work, state) {
            return new AsapAction_1.AsapAction(this, work).schedule(state);
        };
        return AsapScheduler;
    }(QueueScheduler_1.QueueScheduler));
    exports.AsapScheduler = AsapScheduler;
});
//# sourceMappingURL=AsapScheduler.js.map