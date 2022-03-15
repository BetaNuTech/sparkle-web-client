import sinon from 'sinon';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TwoActionCheck from './index';

describe('Common | Inspection Item Controls | Two Action Check', () => {
  afterEach(() => sinon.restore());

  it('should not select any when selected is false', async () => {
    const props = {
      selected: false,
      canEdit: true,
      value: 0
    };

    const { container } = render(<TwoActionCheck {...props} />);

    const elements = container.querySelectorAll('li');

    elements.forEach((e) => expect(e.dataset.test).toEqual(''));
  });

  it('should select first option if given 0', async () => {
    const props = {
      selected: true,
      canEdit: true,
      value: 0
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
      canEdit: true,
      value: 1
    };

    render(<TwoActionCheck {...props} />);

    const checkmarkEl = screen.queryByTestId('control-checkmark');
    const cancelEl = screen.queryByTestId('control-cancel');

    expect(checkmarkEl.dataset.test).toEqual('');
    expect(cancelEl.dataset.test).toEqual('selected');
  });

  it('should select first option for score selection when focused for scoring', async () => {
    const props = {
      selected: false,
      canEdit: true,
      selectedToScore: 0,
      showValues: true,
      item: {}
    };

    render(<TwoActionCheck {...props} />);

    const checkmarkEl = screen.queryByTestId('control-checkmark');
    const cancelEl = screen.queryByTestId('control-cancel');

    expect(checkmarkEl.dataset.testSelectingScore).toEqual('true');
    expect(cancelEl.dataset.testSelectingScore).toEqual('false');
  });

  it('should select second option for score selection when focused for scoring', async () => {
    const props = {
      selected: false,
      canEdit: true,
      selectedToScore: 1,
      showValues: true,
      item: {}
    };

    render(<TwoActionCheck {...props} />);

    const checkmarkEl = screen.queryByTestId('control-checkmark');
    const cancelEl = screen.queryByTestId('control-cancel');

    expect(checkmarkEl.dataset.testSelectingScore).toEqual('false');
    expect(cancelEl.dataset.testSelectingScore).toEqual('true');
  });

  it('should invoke change action for all selections', () => {
    const expected = 2;
    const onClick = sinon.spy();
    const props = {
      canEdit: true,
      onChange: onClick
    };

    const { container } = render(<TwoActionCheck {...props} />);

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

    const { container } = render(<TwoActionCheck {...props} />);

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
