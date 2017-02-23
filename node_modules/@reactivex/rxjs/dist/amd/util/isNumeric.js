define(["require", "exports", '../util/isArray'], function (require, exports, isArray_1) {
    "use strict";
    function isNumeric(val) {
        // parseFloat NaNs numeric-cast false positives (null|true|false|"")
        // ...but misinterprets leading-number strings, particularly hex literals ("0x...")
        // subtraction forces infinities to NaN
        // adding 1 corrects loss of precision from parseFloat (#15100)
        return !isArray_1.isArray(val) && (val - parseFloat(val) + 1) >= 0;
    }
    exports.isNumeric = isNumeric;
    ;
});
//# sourceMappingURL=isNumeric.js.map