import sinon from 'sinon';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TwoActionThumb from './index';

describe('Common | Inspection Item Controls | Two Action Thumb', () => {
  afterEach(() => sinon.restore());

  it('should not select any when selected is false', async () => {
    const props = {
      selected: false,
      canEdit: true,
      value: 0
    };

    const { container } = render(<TwoActionThumb {...props} />);

    const elements = container.querySelectorAll('li');

    elements.forEach((e) => expect(e.dataset.test).toEqual(''));
  });

  it('should select first option if given 0', async () => {
    const props = {
      selected: true,
      canEdit: true,
      value: 0
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
      canEdit: true,
      value: 1
    };

    render(<TwoActionThumb {...props} />);

    const thumbsUp = screen.queryByTestId('control-thumbs-up');
    const thumbsDown = screen.queryByTestId('control-thumbs-down');

    expect(thumbsUp.dataset.test).toEqual('');
    expect(thumbsDown.dataset.test).toEqual('selected');
  });

  it('should invoke change action for all selections', () => {
    const expected = 2;
    const onClick = sinon.spy();
    const props = {
      canEdit: true,
      onChange: onClick
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

  it('should not invoke change action when not editable', () => {
    const expected = false;
    const onClick = sinon.spy();
    const props = {
      canEdit: false,
      onChange: onClick
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
