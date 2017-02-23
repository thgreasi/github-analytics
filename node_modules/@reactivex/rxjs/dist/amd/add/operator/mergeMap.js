define(["require", "exports", '../../Observable', '../../operator/mergeMap'], function (require, exports, Observable_1, mergeMap_1) {
    "use strict";
    Observable_1.Observable.prototype.mergeMap = mergeMap_1.mergeMap;
    Observable_1.Observable.prototype.flatMap = mergeMap_1.mergeMap;
});
//# sourceMappingURL=mergeMap.js.map