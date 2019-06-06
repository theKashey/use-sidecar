import {MediumCallback, MiddlewareCallback, SideMedium, SidePush} from "./types";

const sharedState = new WeakMap();

function ItoI<T>(a: T) {
  return a;
}

export function createMedium<T>(symbol: any, defaults: T, middleware: MiddlewareCallback<T> = ItoI): SideMedium<T> {
  if (sharedState.has(symbol)) {
    return sharedState.get(sharedState);
  }

  let buffer: SidePush<T> = [];
  let assigned = false;
  const medium: SideMedium<T> = {
    read() {
      if (assigned) {
        throw new Error('Sidecar: could not `read` assigned medium');
      }
      return (buffer as Array<T>)[buffer.length - 1];
    },
    useMedium(data: T) {
      const item = middleware(data, assigned);
      buffer.push(item);
      return () => buffer = buffer.filter(x => x !== item);
    },
    assignMedium(cb: MediumCallback<T>) {
      assigned = true;
      while (buffer.length) {
        const cbs = buffer as Array<T>;
        buffer = [];
        cbs.forEach(cb);
      }

      buffer = {
        push: x => cb(x),
        filter: () => buffer,
      }
    },
  };
  sharedState.set(symbol, medium);

  return medium;
}