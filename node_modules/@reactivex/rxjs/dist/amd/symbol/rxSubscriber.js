define(["require", "exports", '../util/root'], function (require, exports, root_1) {
    "use strict";
    var Symbol = root_1.root.Symbol;
    exports.$$rxSubscriber = (typeof Symbol === 'function' && typeof Symbol.for === 'function') ?
        Symbol.for('rxSubscriber') : '@@rxSubscriber';
});
//# sourceMappingURL=rxSubscriber.js.map