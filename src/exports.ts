import {SideMedium} from "./types";

const DoNotImport = () => {
  throw new Error('Sidecar: please provide `sideCar` property to import the right car');
};

DoNotImport.isSideCarExport = true;

export const exportSidecar = (medium: SideMedium<any>, exported: any) => {
  medium.useMedium(exported);
  return DoNotImport;
};