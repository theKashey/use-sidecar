import * as React from 'react';
import {useState, useMemo, useCallback, useLayoutEffect} from "react";
import * as isNode from 'detect-node';

type CombinedProps<T extends any[], K> = { children: (...prop: T) => any } & K;
type RenderPropComponent<T extends any[], K> = React.ComponentType<CombinedProps<T, K>>;

interface Options {
  pure?: boolean;
}

export function clientRenderCar<T extends any[], K>(WrappedComponent: RenderPropComponent<T, K>, defaults: T, options: Options = {}) {
  return function SideRender(props: CombinedProps<T, K>) {
    const [state, setState] = useState(null as any);

    const propagateState = useCallback(
      (state: any) => setState(state),
      options.pure ? [] : [props.children]
    );

    const renderTarget = useMemo(() => {
      return function SideTarget(...args: T) {
        useLayoutEffect(() => propagateState(args));
        return null;
      }
    }, [propagateState]);

    const children = useMemo(() => props.children(...(state || defaults)), [state]);

    return (
      <React.Fragment>
        <WrappedComponent {...props} children={renderTarget}/>
        {children}
      </React.Fragment>
    );
  }
}

export function serverRenderCar<T extends any[], K>(WrappedComponent: RenderPropComponent<T, K>) {
  return function SideRender(props: CombinedProps<T, K>) {
    return <WrappedComponent {...props}/>
  }
}

export function renderCar<T extends any[], K>(WrappedComponent: RenderPropComponent<T, K>, defaults: T, options: Options = {}) {
  return isNode ? serverRenderCar(WrappedComponent) : clientRenderCar(WrappedComponent, defaults, options);
}