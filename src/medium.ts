type removeCb = () => void;
type MediumCallback<T> = (data: T) => any;
type MiddlewareCallback<T> = (data: T, assigned: boolean) => T;
type SidePush<T> = {
  length?: number;

  push(data: T): void;
  filter(cb: (x: T) => boolean): SidePush<T>;
}

interface SideMedium<T> {
  useMedium(data: T): removeCb;

  assignMedium(cb: MediumCallback<T>): void;
}

const sharedState = new WeakMap();

export function createMedium<T>(symbol: any, defaults: T, middleware: MiddlewareCallback<T>): SideMedium<T> {
  if (sharedState.has(symbol)) {
    return sharedState.get(sharedState);
  }

  let buffer: SidePush<T> = [];
  let assigned = false;
  const medium: SideMedium<T> = {
    useMedium(data: T) {
      const item = middleware(data, assigned);
      buffer.push(item);
      return () => buffer = buffer.filter(x => x !== item);
    },
    assignMedium(cb: MediumCallback<T>) {
      while (buffer.length) {
        const cbs = buffer as Array<T>;
        buffer = [];
        cbs.forEach(cb);
      }

      buffer = {
        push: x => cb(x),
        filter: () => buffer,
      }
      ;
    }
  };
  sharedState.set(symbol, medium);

  return medium;
}