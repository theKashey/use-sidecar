"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
function useSidecar(importer) {
    var _a = react_1.useReducer(function (_, s) { return s; }, null), Car = _a[0], setCar = _a[1];
    var _b = react_1.useReducer(function (_, s) { return s; }, null), error = _b[0], setError = _b[1];
    react_1.useEffect(function () {
        importer()
            .then(function (car) { return setCar(car.default); }, function (e) { return setError(e); });
    }, []);
    return [Car, error];
}
exports.useSidecar = useSidecar;
;
