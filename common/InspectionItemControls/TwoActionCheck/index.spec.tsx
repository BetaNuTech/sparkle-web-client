import { render, screen } from '@testing-library/react';
import TwoActionCheck from './index';

describe('Common | Inspection Item Control | Two Action Check', () => {
  it('should not select any when selected is false', async () => {
    const props = {
      selected: false,
      selectedValue: 0
    };

    const { container } = render(<TwoActionCheck {...props} />);

    const elements = container.querySelectorAll('li');

    elements.forEach((e) => expect(e.dataset.test).toEqual(''));
  });

  it('should select first option if given 0', async () => {
    const props = {
      selected: true,
      selectedValue: 0
    };

    render(<TwoActionCheck {...props} />);

    const checkmarkEl = screen.queryByTestId('control-checkmark');
    const cancelEl = screen.queryByTestId('control-cancel');

    expect(checkmarkEl.dataset.test).toEqual('selected');
    expect(cancelEl.dataset.test).toEqual('');
  });

  it('should select second option if given 1', async () => {
    const props = {
      selected: true,
      selectedValue: 1
    };

    render(<TwoActionCheck {...props} />);

    const checkmarkEl = screen.queryByTestId('control-checkmark');
    const cancelEl = screen.queryByTestId('control-cancel');

    expect(checkmarkEl.dataset.test).toEqual('');
    expect(cancelEl.dataset.test).toEqual('selected');
  });
});
