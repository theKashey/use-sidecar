import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import * as React from 'react';

import { sidecar, exportSidecar, createSidecarMedium } from '../src';
import { env } from '../src/env';

configure({ adapter: new Adapter() });

const tick = () => new Promise((resolve) => setTimeout(resolve, 10));

describe('sidecar', () => {
  const noCar = null as any;

  describe('ServerSide', function () {
    beforeEach(() => {
      env.isNode = true;
    });

    it('should never import car', async () => {
      const importer = () => Promise.resolve(() => <div>test</div>);

      const SC = sidecar(importer);

      const wrapper = mount(<SC sideCar={noCar} />);
      expect(wrapper.html()).toBe(null);

      await tick();

      expect(wrapper.update().html()).toBe(null);

      // remount

      const remounted = mount(<SC sideCar={noCar} />);
      expect(remounted.html()).toBe(null);
    });

    it('should load ssr car', async () => {
      const sc = createSidecarMedium({ ssr: true });
      const Comp = exportSidecar(sc, () => <div>test</div>);
      const importer = () => Promise.resolve(Comp);

      const SC = sidecar(importer);

      const wrapper = mount(<SC sideCar={sc} />);
      expect(wrapper.html()).toBe(null);

      await tick();

      expect(wrapper.update().html()).toBe('<div>test</div>');

      // remount

      const remounted = mount(<SC sideCar={sc} />);
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

      const wrapper = mount(<SC sideCar={noCar} />);
      expect(wrapper.html()).toBe(null);

      await tick();

      expect(wrapper.update().html()).toBe('<div>test</div>');

      // remount

      const remounted = mount(<SC sideCar={noCar} />);
      expect(remounted.html()).toBe('<div>test</div>');
    });

    it('should error car', async () => {
      const sc = createSidecarMedium({ async: false });
      const Comp = exportSidecar(sc, () => <div>test</div>);

      expect(() => mount(<Comp sideCar={noCar} />)).toThrow();
    });

    it('typed sidecar error car', async () => {
      const sc1 = createSidecarMedium({ async: false });
      // @ts-expect-error
      exportSidecar(sc1, ({ x }: { x: string }) => <div>{x}</div>);

      const sc2 = createSidecarMedium<{ x: string }>({ async: false });
      exportSidecar(sc2, ({ x }: { x: string }) => <div>{x}</div>);

      const sc3 = createSidecarMedium<{ x: string }>({ async: false });
      exportSidecar(sc3, () => <div>test</div>);

      expect(1).toBe(1);
    });

    it('should load sync car', async () => {
      const sc = createSidecarMedium({ async: false });
      const Comp = exportSidecar(sc, () => <div>test</div>);
      const importer = () => Promise.resolve(Comp);

      const SC = sidecar(importer);

      const wrapper = mount(<SC sideCar={sc} />);
      expect(wrapper.html()).toBe(null);

      await tick();

      expect(wrapper.update().html()).toBe('<div>test</div>');

      // remount

      const remounted = mount(<SC sideCar={sc} />);
      expect(remounted.html()).toBe('<div>test</div>');
    });

    it('should load async car', async () => {
      const sc = createSidecarMedium<{ x: number }>();
      const Comp = exportSidecar(sc, ({ x }) => <div>test {x || 'undefined'}</div>);
      const importer = () => Promise.resolve(Comp);

      const SC = sidecar(importer);

      const wrapper = mount(<SC sideCar={sc} x={42} />);
      expect(wrapper.html()).toBe(null);

      await tick();

      expect(wrapper.update().html()).toBe('<div>test 42</div>');

      // remount

      // @ts-expect-error
      const remounted = mount(<SC sideCar={sc} />);
      expect(remounted.html()).toBe(null);
      await tick();
      expect(remounted.update().html()).toBe('<div>test undefined</div>');
    });
  });
});
