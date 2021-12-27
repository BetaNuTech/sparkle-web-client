import sinon from 'sinon';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TwoActionThumb from './index';

describe('Common | Inspection Item Control | Two Action Thumb', () => {
  afterEach(() => sinon.restore());

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

  it('should invoke click action for all selections when not disabled', () => {
    const expected = 2;
    const onClick = sinon.spy();
    const props = {
      onMainInputChange: onClick
    };

    const { container } = render(<TwoActionThumb {...props} />);

    act(() => {
      const options = Array.from(
        container.querySelectorAll('[data-test-control]')
      );
      options.forEach((option) => userEvent.click(option));
    });

    const actual = onClick.callCount;
    expect(actual).toEqual(expected);
  });

  it('should not invoke click action when disabled', () => {
    const expected = false;
    const onClick = sinon.spy();
    const props = {
      onMainInputChange: onClick,
      isDisabled: true
    };

    const { container } = render(<TwoActionThumb {...props} />);

    act(() => {
      const options = Array.from(
        container.querySelectorAll('[data-test-control]')
      );
      options.forEach((option) => userEvent.click(option));
    });

    const actual = onClick.called;
    expect(actual).toEqual(expected);
  });
});
