import * as React from 'react';
import {useState, useMemo, useCallback, useLayoutEffect} from "react";

type CombinedProps<T extends any[], K> = { children: (...prop: T) => any } & K;
type RenderPropComponent<T extends any[], K> = React.ComponentType<CombinedProps<T, K>>;

interface Options {
  pure?: boolean;
}

export function renderCar<T extends any[], K>(WrappedComponent: RenderPropComponent<T, K>, defaults: (props: K) => T, options: Options = {}) {
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

    const children = useMemo(() => props.children(...(state || defaults(props))), [state]);

    return (
      <React.Fragment>
        <WrappedComponent {...props} children={renderTarget}/>
        {children}
      </React.Fragment>
    );
  }
}