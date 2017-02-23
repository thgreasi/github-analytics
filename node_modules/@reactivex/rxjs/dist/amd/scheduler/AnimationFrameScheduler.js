var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", './QueueScheduler', './AnimationFrameAction'], function (require, exports, QueueScheduler_1, AnimationFrameAction_1) {
    "use strict";
    var AnimationFrameScheduler = (function (_super) {
        __extends(AnimationFrameScheduler, _super);
        function AnimationFrameScheduler() {
            _super.apply(this, arguments);
        }
        AnimationFrameScheduler.prototype.scheduleNow = function (work, state) {
            return new AnimationFrameAction_1.AnimationFrameAction(this, work).schedule(state);
        };
        return AnimationFrameScheduler;
    }(QueueScheduler_1.QueueScheduler));
    exports.AnimationFrameScheduler = AnimationFrameScheduler;
});
//# sourceMappingURL=AnimationFrameScheduler.js.map