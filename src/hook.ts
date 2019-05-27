import {useReducer, useEffect} from 'react';
import {Importer} from "./types";

const cache = new WeakMap();

export function useSidecar<T>(importer: Importer<T>): [React.ComponentType<T> | null, Error | null] {
  const [Car, setCar] = useReducer((_, s) => s, cache.get(importer));
  const [error, setError] = useReducer((_, s) => s, null);

  useEffect(() => {
    if (!Car) {
      importer()
        .then(
          car => {
            cache.set(importer, car.default);
            setCar(car.default)
          },
          e => setError(e),
        )
    }
  }, []);

  return [Car, error];
};