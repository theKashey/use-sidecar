import * as React from 'react';

import { useSidecar } from './hook';
import { Importer, SideCarHOC } from './types';

// eslint-disable-next-line @typescript-eslint/ban-types
export function sidecar<T>(
  importer: Importer<T>,
  errorComponent?: React.ReactNode
): React.FunctionComponent<Omit<T, 'sideCar'> & SideCarHOC<Omit<T, 'sideCar'>>> {
  const ErrorCase: React.FunctionComponent = () => errorComponent as any;

  return function Sidecar(props) {
    const [Car, error] = useSidecar(importer, props.sideCar);

    if (error && errorComponent) {
      return ErrorCase as any;
    }

    // @ts-expect-error type shenanigans
    return Car ? <Car {...props} /> : null;
  };
}
