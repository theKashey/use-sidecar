import {createMedium} from '../src';

describe('medium', () => {
  it('set/read', () => {
    const medium = createMedium(42);
    expect(medium.read()).toBe(42);
    medium.useMedium(24);
    expect(medium.read()).toBe(24);
    medium.useMedium(100);
    expect(medium.read()).toBe(100);
  });

  it('set/use', () => {
    const medium = createMedium();
    medium.useMedium(42);
    medium.useMedium(24);

    const spy = jest.fn();
    const result = [];
    medium.assignMedium(arg => {
      spy(arg);
      result.push(arg);
      if (arg == 42) {
        medium.useMedium(100);
      }
    });

    expect(spy).toHaveBeenCalledWith(42);
    expect(spy).toHaveBeenCalledWith(24);

    expect(result).toEqual([42, 24, 100]);
  })
});