import { render, screen } from '@testing-library/react';
import TwoActionThumb from './index';

describe('Common | Inspection Item Control | Two Action Thumb', () => {
  it('should not select any when selected is false', async () => {
    const props = {
      selected: false,
      selectedValue: 0
    };

    const { container } = render(<TwoActionThumb {...props} />);

    const elements = container.querySelectorAll('li');

    elements.forEach((e) => expect(e.dataset.test).toEqual(''));
  });

  it('should select first option if given 0', async () => {
    const props = {
      selected: true,
      selectedValue: 0
    };

    render(<TwoActionThumb {...props} />);

    const thumbsUp = screen.queryByTestId('control-thumbs-up');
    const thumbsDown = screen.queryByTestId('control-thumbs-down');

    expect(thumbsUp.dataset.test).toEqual('selected');
    expect(thumbsDown.dataset.test).toEqual('');
  });

  it('should select second option if given 1', async () => {
    const props = {
      selected: true,
      selectedValue: 1
    };

    render(<TwoActionThumb {...props} />);

    const thumbsUp = screen.queryByTestId('control-thumbs-up');
    const thumbsDown = screen.queryByTestId('control-thumbs-down');

    expect(thumbsUp.dataset.test).toEqual('');
    expect(thumbsDown.dataset.test).toEqual('selected');
  });
});
