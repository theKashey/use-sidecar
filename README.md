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
  - > `UI` + `sidecar` === `combination`. The size of `UI+sidecar` might a bit bigger than size of their `combination`.
  Use [size-limit](https://github.com/ai/size-limit) to control their size independently. 
  

- package uses a `medium` to talk with own sidecar, breaking explicit dependency.
 
- if package depends on another _sidecar_ package:
  - it shall export dependency side car among own sidecar.
  - package imports own sidecar via `medium`, thus able to export multiple sidecars via one export. 

- final consumer uses `sidecar` or `useSidecar` to combine pieces together.  

## Rules
- `UI` components might use/import any other `UI` components
- `sidecar` could use/import any other `sidecar`

That would form two different code branches, you may load separately - UI first, and effect sidecar later.
That also leads to a obvious consequence - __one sidecar may export all sidecars__.
- to decouple `sidecars` from module exports, and be able to pick "the right" one at any point
you have to use `exportSidecar(medium, component)` to export it, and use the same `medium` to import it back.
- this limitation is for __libraries only__, as long as in the usercode you might 
dynamically import whatever and whenever you want. 

- `useMedium` is always async - action would be executed in a next tick, or on the logic load.
- `sidecar` is always async - is does not matter have you loaded logic or not - component would be 
rendered at least in the next tick.

> except `medium.read`, which synchronously read the data from a medium, 
and `medium.assingSyncMedium` which changes `useMedium` to be sync. 

# API

## createMedium()
- Type: Util. Creates shared effect medium for algebraic effect.
- Goal: To decouple modules from each other.
- Usage: `use` in UI side, and `assign` from side-car. All effects would be executed.
- Analog: WeakMap, React.__SECRET_DOM_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
```js
const medium = createMedium(defaultValue);
const cancelCb = medium.useMedium(someData);

// like
useEffect(() => medium.useMedium(someData), []);

medium.assignMedium(someDataProcessor)

// createSidecarMedium is a helper for createMedium to create a "sidecar" symbol
const effectCar = createSidecarMedium();
```

> ! For consistence `useMedium` is async - sidecar load status should not affect function behavior,
thus effect would be always executed at least in the "next tick". You may alter
this behavior by using `medium.assingSyncMedium`.


## exportSidecar(medium, component)
- Type: HOC
- Goal: store `component` inside `medium` and return external wrapper
- Solving: decoupling module exports to support exporting multiple sidecars via a single entry point.
- Usage: use to export a `sidecar`
- Analog: WeakMap
```js
import {effectCar} from './medium';
import {EffectComponent} from './Effect';
// !!! - to prevent Effect from being imported
// `effectCar` medium __have__ to be defined in another file
// const effectCar = createSidecarMedium();
export default exportSidecar(effectCar, EffectComponent);
```

## sidecar(importer)
- Type: HOC
- Goal: React.lazy analog for code splitting, but does not require `Suspense`, might provide error failback.
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
### Importing `exportedSidecar`
Would require additional prop to be set - ```<Sidecar sideCar={effectCar} />```

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
### Importing `exportedSideCar`
You have to specify __effect medium__ to read data from, as long as __export itself is empty__.
```js
import {useSidecar} from 'use-sidecar';

/* medium.js: */ export const effectCar = useMedium({});
/* sideCar.js: */export default exportSidecar(effectCar, EffectComponent);

const [Car, error] = useSidecar(() => import('./sideCar'), effectCar); 
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

## setConfig(config)
```js
setConfig({
  onError, // sets default error handler
});
```

# Licence

MIT

