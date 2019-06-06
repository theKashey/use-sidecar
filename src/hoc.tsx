import * as React from 'react';
import {Importer, SideCarHOC} from "./types";
import {useSidecar} from "./hook";

export function sidecar<T>(importer: Importer<T>, errorComponent?: React.ReactNode): React.FunctionComponent<T & SideCarHOC> {
  const ErrorCase: React.FunctionComponent = () => (errorComponent as any);

  return function Sidecar(props) {
    const [Car, error] = useSidecar(importer, props.sideCar);

    if (error && errorComponent) {
      return ErrorCase as any;
    }

    return Car ? <Car {...props} /> : null;
  }
}