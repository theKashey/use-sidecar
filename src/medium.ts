import {MediumCallback, MiddlewareCallback, SideCarMedium, SideMedium, SidePush} from "./types";

function ItoI<T>(a: T) {
  return a;
}

export function createMedium<T>(defaults: T, middleware: MiddlewareCallback<T> = ItoI): SideMedium<T> {
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

  return medium;
}

export function createSidecarMedium(): SideCarMedium {
  return createMedium(null as any);
}