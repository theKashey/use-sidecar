<div align="center">
  <h1>🏎 side car</h1>
  <br/>
   Alternative way to code splitting
  <br/>
   🧪 experimental ✂️
  <br/>
  <br/>
  
  <a href="https://www.npmjs.com/package/use-sidecar">
    <img src="https://img.shields.io/npm/v/use-sidecar.svg?style=flat-square" />
  </a>
    
  <a href="https://circleci.com/gh/theKashey/use-sidecar/tree/master">
   <img src="https://img.shields.io/circleci/project/github/theKashey/use-sidecar/master.svg?style=flat-square)" alt="Build status">
  </a> 

  <a href="https://www.npmjs.com/package/use-sidecar">
   <img src="https://img.shields.io/npm/dm/use-sidecar.svg" alt="npm downloads">
  </a> 

  <a href="https://bundlephobia.com/result?p=use-sidecar">
   <img src="https://img.shields.io/bundlephobia/minzip/use-sidecar.svg" alt="bundle size">
  </a>   
  <br/>
</div>

UI/Effects code splitting pattern - [read more](https://dev.to/thekashey/sidecar-for-a-code-splitting-1o8g).

## SSR and usage tracking
Sidecar pattern is clear:
- you dont need to use/render any `sidecars` on server.
- you dont have to load `sidecars` prior main render.

Thus - no usage tracking, and literally no SSR. It's just skipped.

## Terminology: 
- `sidecar`(robin) - not UI component, which may carry effects for a paired UI component.
- `UI`(batman) - UI component, which interactivity is moved to a `sidecar`.

## Concept
- a `package` exposes __3 entry points__ using a [nested `package.json` format](https://github.com/theKashey/multiple-entry-points-example):
 - default aka `combination`, and lets hope tree shaking will save you
 - `UI`, with only UI part
 - `sidecar`, with all the logic
 - `UI` + `sidecar` === `combination`. If they are bigger, then something is too coupled.
 
- if package dependent on another _sidecar_ package:
 - it shall export dependency side car among own sidecar.
 
- package uses `medium` to talk with own sidecar, breaking explicit dependency.
  
- final consumer uses `sidecar` or `useSidecar` to combine pieces together.
 - that's why packags itself is not using it - it's not the "final" consumer.

# API

## sidecar(importer)
- Type: HOC, `React.lazy` analog. Does not require `Suspense`, might provide error failback.
- Goal: React.lazy analog for code splitting
- Usage: like React.lazy to load a side-car component.
- Analog: React.Lazy
```js
import {sidecar} from "use-sidecar";
const Sidecar =  sidecar(() => import('./sidecar'), <span>on fail</span>);

<>
 <Sidecar />
 <UI />
</> 
```

## useSidecar(importer)
- Type: hook, loads a `sideCar` using provided `importer` which shall follow React.lazy API
- Goal: to load a side car without displaying any "spinners".
- Usage: load side car for a component
- Analog: none
```js
import {useSidecar} from 'use-sidecar';

const [Car, error] = useSidecar(() => import('./sideCar'));
return (
  <>
    {Car ? <Car {...props} /> : null}
    <UIComponent {...props}>
  </>
); 
```

## renderCar(Component)
- Type: HOC, moves renderProp component to a side channel
- Goal: Provide render prop support, ie defer component loading keeping tree untouched.
- Usage: Provide `defaults` and use them until sidecar is loaded letting you code split (non visual) render-prop component
- Analog: - Analog: code split library like [react-imported-library](https://github.com/theKashey/react-imported-library) or [@loadable/lib](https://www.smooth-code.com/open-source/loadable-components/docs/library-splitting/).
```js
import {renderCar, sidecar} from "use-sidecar";
const RenderCar = renderCar(
  // will move side car to a side channel
  sidecar(() => import('react-powerplug').then(imports => imports.Value)),
  // default render props
  [{value: 0}]  
);

<RenderCar>
  {({value}) => <span>{value}</span>}
</RenderCar>
```

## createMedium(symbol)
- Type: Util. Creates shared effect medium for algebraic effect.
- Goal: To decouple modules from each other.
- Usage: `use` in UI side, and `assign` from side-car. All effects would be executed.
- Analog: React.__SECRET_DOM_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
```js
const medium = createMedium(SECRET);
const cancelCb = medium.useMedium(someData);

// like
useEffect(() => medium.useMedium(someData), []);

medium.assignMedium(dataProcessor)
```

## setConfig(config)
```js
setConfig({
  onError, // sets default error handler
});
```

# Licence

MIT

