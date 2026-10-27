import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import sinon from 'sinon';
import Filters from './index';

const baseProps = {
  state: 'open' as const,
  unit: '',
  from: '',
  to: '',
  hasFilters: false,
  onStateChange: () => null,
  onUnitChange: () => null,
  onFromChange: () => null,
  onToChange: () => null,
  onClearFilters: () => null
};

describe('Unit | Features | Property Work Orders | Filters', () => {
  it('should offer open and closed states', () => {
    render(<Filters {...baseProps} />);
    const select = screen.getByTestId('work-order-state-filter');
    const options = Array.from(select.querySelectorAll('option')).map((o) =>
      o.getAttribute('value')
    );
    expect(options).toEqual(['open', 'closed']);
  });

  it('should invoke state change when a state is selected', () => {
    const onStateChange = sinon.spy();
    render(<Filters {...baseProps} onStateChange={onStateChange} />);
    userEvent.selectOptions(
      screen.getByTestId('work-order-state-filter'),
      'closed'
    );
    expect(onStateChange.called).toEqual(true);
  });

  it('should only show the clear action when filters are set', () => {
    const { rerender } = render(<Filters {...baseProps} />);
    expect(screen.queryByTestId('work-order-clear-filters')).toBeNull();

    rerender(<Filters {...baseProps} unit="1724" hasFilters />);
    expect(screen.queryByTestId('work-order-clear-filters')).toBeTruthy();
  });

  it('should explain the default closed range when no from date is set', () => {
    const { rerender } = render(<Filters {...baseProps} state="closed" />);
    expect(screen.queryByTestId('work-order-closed-hint')).toBeTruthy();

    rerender(<Filters {...baseProps} state="closed" from="2026-01-01" />);
    expect(screen.queryByTestId('work-order-closed-hint')).toBeNull();
  });
});
