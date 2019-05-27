import {useReducer, useEffect} from 'react';
import * as isNode from 'detect-node';
import {Importer} from "./types";

const cache = new WeakMap();

export function useSidecar<T>(importer: Importer<T>): [React.ComponentType<T> | null, Error | null] {
  const [Car, setCar] = useReducer((_, s) => s, isNode ? undefined : cache.get(importer));
  const [error, setError] = useReducer((_, s) => s, null);

  useEffect(() => {
    if (!Car) {
      importer()
        .then(
          car => {
            const resolved: T = (car as any).default || car;
            cache.set(importer, resolved);
            setCar(resolved);
          },
          e => setError(e),
        )
    }
  }, []);

  return [Car, error];
};