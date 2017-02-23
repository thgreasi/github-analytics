define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.isArray = Array.isArray || (function (x) { return x && typeof x.length === 'number'; });
});
//# sourceMappingURL=isArray.js.map