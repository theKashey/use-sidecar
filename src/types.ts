import * as React from "react";

export type removeCb = () => void;
export type MediumCallback<T> = (data: T) => any;
export type MiddlewareCallback<T> = (data: T, assigned: boolean) => T;
export type SidePush<T> = {
  length?: number;

  push(data: T): void;
  filter(cb: (x: T) => boolean): SidePush<T>;
}

export interface SideMedium<T> {
  useMedium(data: T): removeCb;

  assignMedium(cb: MediumCallback<T>): void;

  read(): T | undefined;
}


export type DefaultOrNot<T> = { default: T } | T;

export type Importer<T> = () => Promise<DefaultOrNot<React.ComponentType<T>>>;

export type SideCarMedium = SideMedium<React.ComponentType>;

export type SideCarHOC = {
  sideCar: SideCarMedium;
}

export type SideCarComponent<T> = React.FunctionComponent<T & SideCarHOC>;