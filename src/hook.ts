import {useState, useEffect} from 'react';
import {env} from './env';
import {Importer, SideMedium} from "./types";

const cache = new WeakMap();

export function useSidecar<T>(importer: Importer<T>, effect?: SideMedium<any>): [React.ComponentType<T> | null, Error | null] {
  const options: any = effect && effect.options || {};

  if(env.isNode && !options.ssr){
    return [null, null];
  }

  const couldUseCache = env.forceCache || (env.isNode && !!options.ssr) || (!options.async);

  const [Car, setCar] = useState(couldUseCache ? () => cache.get(importer) : undefined);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!Car) {
      importer()
        .then(
          car => {
            const resolved: T = effect ? effect.read() : ((car as any).default || car);
            if (!resolved) {
              console.error('Sidecar error: with importer', importer);
              if (effect) {
                throw new Error('Sidecar medium not found');
              } else {
                throw new Error('Sidecar not found in exports');
              }
            }
            cache.set(importer, resolved);
            setCar(() => resolved);
          },
          e => setError(() => e),
        )
    }
  }, []);

  return [Car, error];
};