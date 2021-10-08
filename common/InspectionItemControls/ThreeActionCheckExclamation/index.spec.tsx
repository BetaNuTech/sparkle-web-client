import { render, screen } from '@testing-library/react';
import ThreeActionCheckExclamation from './index';

describe('Common | Inspection Item Control | Three Action Check Exclaimation', () => {
  it('should not select any when selected is false', async () => {
    const props = {
      selected: false,
      selectedValue: 0
    };

    const { container } = render(<ThreeActionCheckExclamation {...props} />);

    const elements = container.querySelectorAll('li');

    elements.forEach((e) => expect(e.dataset.test).toEqual(''));
  });

  it('should select first option if given 0', async () => {
    const props = {
      selected: true,
      selectedValue: 0
    };

    render(<ThreeActionCheckExclamation {...props} />);

    const iconCheckmarkEl = screen.queryByTestId('control-icon-checkmark');
    const iconCautionEl = screen.queryByTestId('control-icon-caution');
    const iconCancelEl = screen.queryByTestId('control-icon-cancel');

    expect(iconCheckmarkEl.dataset.test).toEqual('selected');
    expect(iconCautionEl.dataset.test).toEqual('');
    expect(iconCancelEl.dataset.test).toEqual('');
  });

  it('should select second option if given 1', async () => {
    const props = {
      selected: true,
      selectedValue: 1
    };

    render(<ThreeActionCheckExclamation {...props} />);

    const iconCheckmarkEl = screen.queryByTestId('control-icon-checkmark');
    const iconCautionEl = screen.queryByTestId('control-icon-caution');
    const iconCancelEl = screen.queryByTestId('control-icon-cancel');

    expect(iconCheckmarkEl.dataset.test).toEqual('');
    expect(iconCautionEl.dataset.test).toEqual('selected');
    expect(iconCancelEl.dataset.test).toEqual('');
  });

  it('should select second option if given 2', async () => {
    const props = {
      selected: true,
      selectedValue: 2
    };

    render(<ThreeActionCheckExclamation {...props} />);

    const iconCheckmarkEl = screen.queryByTestId('control-icon-checkmark');
    const iconCautionEl = screen.queryByTestId('control-icon-caution');
    const iconCancelEl = screen.queryByTestId('control-icon-cancel');

    expect(iconCheckmarkEl.dataset.test).toEqual('');
    expect(iconCautionEl.dataset.test).toEqual('');
    expect(iconCancelEl.dataset.test).toEqual('selected');
  });
});
