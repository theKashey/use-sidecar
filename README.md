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


# API
Terminology: 
- `side-car` - not UI component, which may carry effects for a paired UI component.

## useSidecar(importer)
- Type: hook, loads a `sideCar` using provided `importer` which shall follow React.lazy API
- Goal: to load a side car without displaying any "spinners".
- Usage: load side car for a component
```js
import {useSidecar} from 'use-sidecar';

const [Car, error] = useSidecar(() => import('./sideCar'));
return (
  <>
    {Car ? <Car {...props} /> : null}
    <UIComponent {...props}>
  </>
) 
```

## sidecar(importer)
- Type: HOC, `React.lazy` analog. Does not require `Suspense`, might provide error failback.
- Goal: React.lazy analog for code splitting
- Usage: like React.lazy to load a side-car component.
```js
import {sidecar} from "use-sidecar";
const Sidecar =  sidecar(() => import('./sidecar'), <span>on fail</span>);

<>
 <Sidecar />
 <UI />
</> 
```

## renderCar(importer)
- Type: HOC, moves renderProp component to a side channel
- Goal: Provide render prop support, ie defer component loading keeping tree untouched.
- Usage: Provide `defaults` and use them until sidecar is loaded.
```js
import {renderCar} from "use-sidecar";
const RenderCar = renderCar(() => import('react-powerplug'), [{value: 0}]);

<RenderCar>
  {({value}) => <span>{value}</span>}
</RenderCar>
```

## createMedium(symbol)
- Type: Util. Creates shared effect medium for algebraic effect.
- Goal: To decouple modules from each other.
- Usage: `use` in UI side, and `assign` from side-car. All effects would be executed.
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

