import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import useWorkOrderFilters from './useWorkOrderFilters';

describe('Unit | Features | Property Work Orders | hooks | Use Work Order Filters', () => {
  test('should default to open work orders with no other filters', () => {
    const { result } = renderHook(() => useWorkOrderFilters());
    expect(result.current.state).toEqual('open');
    expect(result.current.filters).toEqual({ state: 'open' });
    expect(result.current.hasFilters).toEqual(false);
  });

  test('should toggle between open and closed states', () => {
    const { result } = renderHook(() => useWorkOrderFilters());

    act(() => result.current.nextState());
    expect(result.current.state).toEqual('closed');

    act(() => result.current.nextState());
    expect(result.current.state).toEqual('open');

    act(() =>
      result.current.onStateChange({ target: { value: 'closed' } } as any)
    );
    expect(result.current.filters.state).toEqual('closed');
  });

  test('should only include unit and dates in filters when set', () => {
    const expected = {
      state: 'open',
      unit: '1724',
      from: '2026-01-01',
      to: '2026-02-01'
    };
    const { result } = renderHook(() => useWorkOrderFilters());

    act(() =>
      result.current.onUnitChange({ target: { value: ' 1724 ' } } as any)
    );
    act(() =>
      result.current.onFromChange({ target: { value: '2026-01-01' } } as any)
    );
    act(() =>
      result.current.onToChange({ target: { value: '2026-02-01' } } as any)
    );

    expect(result.current.filters).toEqual(expected);
    expect(result.current.hasFilters).toEqual(true);

    act(() => result.current.onClearFilters());
    expect(result.current.filters).toEqual({ state: 'open' });
    expect(result.current.hasFilters).toEqual(false);
  });
});
