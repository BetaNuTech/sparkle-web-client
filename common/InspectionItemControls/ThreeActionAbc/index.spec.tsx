import { render, screen } from '@testing-library/react';
import ThreeActionAbc from './index';

describe('Common | Inspection Item Control | Three Action Abc', () => {
  it('should not select any when selected is false', async () => {
    const props = {
      selected: false,
      selectedValue: 0
    };

    const { container } = render(<ThreeActionAbc {...props} />);

    const elements = container.querySelectorAll('li');

    elements.forEach((e) => expect(e.dataset.test).toEqual(''));
  });

  it('should select first option if given 0', async () => {
    const props = {
      selected: true,
      selectedValue: 0
    };

    render(<ThreeActionAbc {...props} />);

    const iconAEl = screen.queryByTestId('control-icon-a');
    const iconBEl = screen.queryByTestId('control-icon-b');
    const iconCEl = screen.queryByTestId('control-icon-c');

    expect(iconAEl.dataset.test).toEqual('selected');
    expect(iconBEl.dataset.test).toEqual('');
    expect(iconCEl.dataset.test).toEqual('');
  });

  it('should select second option if given 1', async () => {
    const props = {
      selected: true,
      selectedValue: 1
    };

    render(<ThreeActionAbc {...props} />);

    const iconAEl = screen.queryByTestId('control-icon-a');
    const iconBEl = screen.queryByTestId('control-icon-b');
    const iconCEl = screen.queryByTestId('control-icon-c');

    expect(iconAEl.dataset.test).toEqual('');
    expect(iconBEl.dataset.test).toEqual('selected');
    expect(iconCEl.dataset.test).toEqual('');
  });

  it('should select second option if given 2', async () => {
    const props = {
      selected: true,
      selectedValue: 2
    };

    render(<ThreeActionAbc {...props} />);

    const iconAEl = screen.queryByTestId('control-icon-a');
    const iconBEl = screen.queryByTestId('control-icon-b');
    const iconCEl = screen.queryByTestId('control-icon-c');

    expect(iconAEl.dataset.test).toEqual('');
    expect(iconBEl.dataset.test).toEqual('');
    expect(iconCEl.dataset.test).toEqual('selected');
  });
});
