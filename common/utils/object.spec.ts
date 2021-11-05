import { replaceContent } from './object';

describe('Unit | Common | Utils | Object Helper', () => {
  test('replaces the contents of source object with the destination object', () => {
    const original = {
      a: 1,
      b: 4,
      d: 1
    };
    const toCopyFrom = {
      b: 2,
      d: 5,
      e: 6
    };
    const afterReplace = replaceContent(original, toCopyFrom);

    expect(original).toEqual(toCopyFrom); // deep equal
    expect(afterReplace).toEqual(toCopyFrom); // deep equal
    expect(afterReplace === original).toEqual(true); // making sure reference is equal
    expect(afterReplace === toCopyFrom).toEqual(false);
  });
});
