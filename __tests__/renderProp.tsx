import * as React from 'react';
import {mount} from 'enzyme';

import {renderCar, sidecar} from '../src';

const tick = () => new Promise(resolve => setTimeout(resolve, 10));

describe('RenderProp', () => {
  it('smoke', async () => {
    let resolveExternal;

    interface BaseProps {
      y: number;
    }

    interface Props {
      x: number;

      children(props: BaseProps): React.ReactNode;
    };

    const external = new Promise<React.FC<Props>>(resolve => {
      resolveExternal = resolve;
    });
    const Car = sidecar(() => external);
    const CarRender = renderCar(Car, (props: Props = {} as any) => [{y: props.x + 1}]);

    const fn = jest.fn();

    const App = ({x}) => (
      <div>
        <CarRender x={x}>{props => {
          fn(props);
          return props.y;
        }}</CarRender>
      </div>
    )

    const wrapper = mount(<App x={1}/>);

    expect(wrapper.html()).toBe("<div>2</div>");
    expect(fn).toHaveBeenCalledWith({y: 2});
    expect(fn).toHaveBeenCalledTimes(1);

    resolveExternal((props: Props) => {
      return props.children({y: (props.x + 2) * 2});
    });

    await tick();

    wrapper.update();

    expect(wrapper.html()).toBe("<div>6</div>");
    expect(fn).toHaveBeenCalledWith({y: 6});
    expect(fn).toHaveBeenCalledTimes(2);

    wrapper.setProps({x: 2});

    expect(wrapper.html()).toBe("<div>8</div>");
    expect(fn).toHaveBeenCalledTimes(3);
  });
});
