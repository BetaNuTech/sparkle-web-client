import { renderHook } from '@testing-library/react-hooks';

import useIsFirstMount from './useIsFirstMount';

describe('Unit | Features | Properties | Hooks | use IsFirstMount', () => {
  it('should be true on first render and false after', () => {
    const { result, rerender } = renderHook(() => useIsFirstMount());
    expect(result.current).toEqual(true);
    rerender();
    expect(result.current).toEqual(false);
    rerender();
    expect(result.current).toEqual(false);
  });
});
