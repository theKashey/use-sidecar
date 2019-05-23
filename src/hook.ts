import {useReducer, useEffect} from 'react';
import {Importer} from "./types";

export function useSidecar<T>(importer: Importer<T>): [React.ComponentType<T> | null, Error | null] {
  const [Car, setCar] = useReducer((_, s) => s, null);
  const [error, setError] = useReducer((_, s) => s, null);

  useEffect(() => {
    importer()
      .then(
        car => setCar(car.default),
        e => setError(e),
      )
  }, []);

  return [Car, error];
};