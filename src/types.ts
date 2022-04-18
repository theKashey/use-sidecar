import * as React from 'react';

export type removeCb = () => void;
export type MediumCallback<T> = (data: T) => any;
export type MiddlewareCallback<T> = (data: T, assigned: boolean) => T;
export type SidePush<T> = {
  length?: number;

  push(data: T): void;
  filter(cb: (x: T) => boolean): SidePush<T>;
};

/**
 * An object describing side medium
 */
export interface SideMedium<T> {
  /**
   * Pushes effect to the medium
   * @param effect any information for real handler
   */
  useMedium(effect: T): removeCb;

  /**
   * Assigns effect handler to the medium
   * @param {Function(effect: T)} handler effect handler
   */
  assignMedium(handler: MediumCallback<T>): void;

  /**
   * Assigns a synchronous effect handler to the medium, which would be executed right on call
   * @param {Function(effect: T)} handler effect handler
   */
  assignSyncMedium(handler: MediumCallback<T>): void;

  /**
   * reads the data stored in the medium
   */
  read(): T | undefined;

  options?: Record<string, any>;
}

export type DefaultOrNot<T> = { default: T } | T;

export type Importer<T> = () => Promise<DefaultOrNot<React.ComponentType<T>>>;

// eslint-disable-next-line @typescript-eslint/ban-types
export type SideCarMedium<T = {}> = SideMedium<React.ComponentType<T>>;

// eslint-disable-next-line @typescript-eslint/ban-types
export declare type SideCarHOC<T = {}> = {
  readonly sideCar: SideCarMedium<T>;
};
export declare type SideCarComponent<T> = React.FunctionComponent<T & SideCarHOC<T>>;

export type SideCarMediumOptions = {
  async?: boolean;
  ssr?: boolean;
};
