import * as React from 'react';
import {SideCarComponent, SideCarMedium} from "./types";

const DoNotImport = ({sideCar, ...rest}: any) => {
  if (!sideCar) {
    throw new Error('Sidecar: please provide `sideCar` property to import the right car');
  }
  const Target = sideCar.read();
  if (!Target) {
    throw new Error('Sidecar medium not found');
  }
  return <Target {...rest} />;
};

DoNotImport.isSideCarExport = true;

export function exportSidecar<T>(medium: SideCarMedium, exported: React.ComponentType<T>): SideCarComponent<T> {
  medium.useMedium(exported);
  return DoNotImport as any;
}