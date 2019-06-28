import * as React from 'react';
import {mount} from 'enzyme';

import {sidecar, exportSidecar, createSidecarMedium} from "../src";
import {env} from '../src/env';

const tick = () => new Promise(resolve => setTimeout(resolve, 10));

describe('sidecar', () => {
  describe('ServerSide', function () {
    beforeEach(() => {
      env.isNode = true
    });

    it('should never import car', async () => {
      const importer = () => Promise.resolve(() => <div>test</div>);

      const SC = sidecar(importer);

      const wrapper = mount(<SC sideCar={null}/>);
      expect(wrapper.html()).toBe(null);

      await tick();

      expect(wrapper.update().html()).toBe(null);

      // remount

      const remounted = mount(<SC sideCar={null}/>);
      expect(remounted.html()).toBe(null);
    });

    it('should load ssr car', async () => {
      const sc = createSidecarMedium({ssr: true});
      const Comp = exportSidecar(sc, () => <div>test</div>);
      const importer = () => Promise.resolve(Comp);

      const SC = sidecar(importer);

      const wrapper = mount(<SC sideCar={sc}/>);
      expect(wrapper.html()).toBe(null);

      await tick();

      expect(wrapper.update().html()).toBe('<div>test</div>');

      // remount

      const remounted = mount(<SC sideCar={sc}/>);
      expect(remounted.html()).toBe('<div>test</div>');
    });
  });


  describe('ClientSide', function () {
    beforeEach(() => {
      env.isNode = false;
    });

    it('should load import car', async () => {
      const importer = () => Promise.resolve(() => <div>test</div>);

      const SC = sidecar(importer);

      const wrapper = mount(<SC sideCar={null}/>);
      expect(wrapper.html()).toBe(null);

      await tick();

      expect(wrapper.update().html()).toBe('<div>test</div>');

      // remount

      const remounted = mount(<SC sideCar={null}/>);
      expect(remounted.html()).toBe('<div>test</div>');
    });

    it('should error car', async () => {
      const sc = createSidecarMedium({async: false});
      const Comp = exportSidecar(sc, () => <div>test</div>);

      expect(() => mount(<Comp sideCar={null}/>)).toThrow();
    });

    it('should load sync car', async () => {
      const sc = createSidecarMedium({async: false});
      const Comp = exportSidecar(sc, () => <div>test</div>);
      const importer = () => Promise.resolve(Comp);

      const SC = sidecar(importer);

      const wrapper = mount(<SC sideCar={sc}/>);
      expect(wrapper.html()).toBe(null);

      await tick();

      expect(wrapper.update().html()).toBe('<div>test</div>');

      // remount

      const remounted = mount(<SC sideCar={sc}/>);
      expect(remounted.html()).toBe('<div>test</div>');
    });

    it('should load async car', async () => {
      const sc = createSidecarMedium();
      const Comp = exportSidecar(sc, () => <div>test</div>);
      const importer = () => Promise.resolve(Comp);

      const SC = sidecar(importer);

      const wrapper = mount(<SC sideCar={sc}/>);
      expect(wrapper.html()).toBe(null);

      await tick();

      expect(wrapper.update().html()).toBe('<div>test</div>');

      // remount

      const remounted = mount(<SC sideCar={sc}/>);
      expect(remounted.html()).toBe(null);
      await tick();
      expect(remounted.update().html()).toBe('<div>test</div>');
    });
  });
});