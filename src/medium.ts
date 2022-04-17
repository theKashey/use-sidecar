import { MediumCallback, MiddlewareCallback, SideCarMedium, SideCarMediumOptions, SideMedium, SidePush } from './types';

function ItoI<T>(a: T) {
  return a;
}

function innerCreateMedium<T>(defaults?: T, middleware: MiddlewareCallback<T> = ItoI): SideMedium<T> {
  let buffer: SidePush<T> = [];
  let assigned = false;

  const medium: SideMedium<T> = {
    read(): T {
      if (assigned) {
        throw new Error(
          'Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.'
        );
      }

      if (buffer.length) {
        return (buffer as Array<T>)[buffer.length - 1];
      }

      return defaults!;
    },
    useMedium(data: T) {
      const item = middleware(data, assigned);
      buffer.push(item);

      return () => {
        buffer = buffer.filter((x) => x !== item);
      };
    },
    assignSyncMedium(cb: MediumCallback<T>) {
      assigned = true;

      while (buffer.length) {
        const cbs = buffer as Array<T>;
        buffer = [];
        cbs.forEach(cb);
      }

      buffer = {
        push: (x) => cb(x),
        filter: () => buffer,
      };
    },
    assignMedium(cb: MediumCallback<T>) {
      assigned = true;

      let pendingQueue: Array<T> = [];

      if (buffer.length) {
        const cbs = buffer as Array<T>;
        buffer = [];
        cbs.forEach(cb);
        pendingQueue = buffer as Array<T>;
      }

      const executeQueue = () => {
        const cbs = pendingQueue;
        pendingQueue = [];
        cbs.forEach(cb);
      };

      const cycle = () => Promise.resolve().then(executeQueue);

      cycle();

      buffer = {
        push: (x) => {
          pendingQueue.push(x);
          cycle();
        },
        filter: (filter) => {
          pendingQueue = pendingQueue.filter(filter);

          return buffer;
        },
      };
    },
  };

  return medium;
}

export function createMedium<T>(defaults?: T, middleware: MiddlewareCallback<T> = ItoI): Readonly<SideMedium<T>> {
  return innerCreateMedium(defaults, middleware);
}

export function createSidecarMedium(options: SideCarMediumOptions = {}): Readonly<SideCarMedium> {
  const medium = innerCreateMedium(null as any);

  medium.options = {
    async: true,
    ssr: false,
    ...options,
  };

  return medium;
}
