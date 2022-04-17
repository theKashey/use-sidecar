import { useState, useEffect } from 'react';

import { env } from './env';
import { Importer, SideMedium } from './types';

const cache = new WeakMap();

const NO_OPTIONS = {};

export function useSidecar<T>(
  importer: Importer<T>,
  effect?: SideMedium<any>
): [React.ComponentType<T> | null, Error | null] {
  const options: any = (effect && effect.options) || NO_OPTIONS;

  if (env.isNode && !options.ssr) {
    return [null, null];
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useRealSidecar(importer, effect);
}

function useRealSidecar<T>(
  importer: Importer<T>,
  effect?: SideMedium<any>
): [React.ComponentType<T> | null, Error | null] {
  const options: any = (effect && effect.options) || NO_OPTIONS;

  const couldUseCache = env.forceCache || (env.isNode && !!options.ssr) || !options.async;

  const [Car, setCar] = useState(couldUseCache ? () => cache.get(importer) : undefined);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!Car) {
      importer().then(
        (car) => {
          const resolved: T = effect ? effect.read() : (car as any).default || car;

          if (!resolved) {
            console.error('Sidecar error: with importer', importer);

            let error: Error;

            if (effect) {
              console.error('Sidecar error: with medium', effect);
              error = new Error('Sidecar medium was not found');
            } else {
              error = new Error('Sidecar was not found in exports');
            }

            setError(() => error);
            throw error;
          }

          cache.set(importer, resolved);
          setCar(() => resolved);
        },
        (e) => setError(() => e)
      );
    }
  }, []);

  return [Car, error];
}
