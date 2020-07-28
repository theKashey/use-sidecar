export const namedSidecar = (sideCar: any, name: string) => {
  sideCar.displayName = name;
};

export const getSidecarName = (sideCar: any) => sideCar && sideCar.displayName || 'unnamed sidecar';
