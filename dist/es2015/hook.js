import { useReducer, useEffect } from 'react';
export function useSidecar(importer) {
    var _a = useReducer(function (_, s) { return s; }, null), Car = _a[0], setCar = _a[1];
    var _b = useReducer(function (_, s) { return s; }, null), error = _b[0], setError = _b[1];
    useEffect(function () {
        importer()
            .then(function (car) { return setCar(car.default); }, function (e) { return setError(e); });
    }, []);
    return [Car, error];
}
;
