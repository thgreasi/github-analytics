define(["require", "exports", './zip'], function (require, exports, zip_1) {
    "use strict";
    /**
     * @param project
     * @return {Observable<R>|WebSocketSubject<T>|Observable<T>}
     * @method zipAll
     * @owner Observable
     */
    function zipAll(project) {
        return this.lift(new zip_1.ZipOperator(project));
    }
    exports.zipAll = zipAll;
});
//# sourceMappingURL=zipAll.js.map