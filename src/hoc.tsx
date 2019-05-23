import * as React from 'react';
import {Importer} from "./types";
import {useSidecar} from "./hook";

export function sidecar<T>(importer: Importer<T>, errorComponent?: React.ReactNode): React.FunctionComponent<T> {
  const ErrorCase: React.FunctionComponent = () => (errorComponent as any);

  return function Sidecar(props) {
    const [Car, error] = useSidecar(importer);

    if (error && errorComponent) {
      return ErrorCase as any;
    }

    return Car ? <Car {...props} /> : null;
  }
}