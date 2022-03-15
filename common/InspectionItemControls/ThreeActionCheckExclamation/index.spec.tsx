import sinon from 'sinon';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ThreeActionCheckExclamation from './index';

describe('Common | Inspection Item Controls | Three Action Check Exclaimation', () => {
  afterEach(() => sinon.restore());

  it('should not select any when selected is false', async () => {
    const props = {
      selected: false,
      canEdit: true,
      value: 0
    };

    const { container } = render(<ThreeActionCheckExclamation {...props} />);

    const elements = container.querySelectorAll('li');

    elements.forEach((e) => expect(e.dataset.test).toEqual(''));
  });

  it('should select first option if given 0', async () => {
    const props = {
      selected: true,
      canEdit: true,
      value: 0
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
      canEdit: true,
      value: 1
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
      canEdit: true,
      value: 2
    };

    render(<ThreeActionCheckExclamation {...props} />);

    const iconCheckmarkEl = screen.queryByTestId('control-icon-checkmark');
    const iconCautionEl = screen.queryByTestId('control-icon-caution');
    const iconCancelEl = screen.queryByTestId('control-icon-cancel');

    expect(iconCheckmarkEl.dataset.test).toEqual('');
    expect(iconCautionEl.dataset.test).toEqual('');
    expect(iconCancelEl.dataset.test).toEqual('selected');
  });

  it('should select first option for score selection when focused for scoring', async () => {
    const props = {
      selected: false,
      canEdit: true,
      selectedToScore: 0,
      showValues: true,
      item: {}
    };

    render(<ThreeActionCheckExclamation {...props} />);

    const iconCheckmarkEl = screen.queryByTestId('control-icon-checkmark');
    const iconCautionEl = screen.queryByTestId('control-icon-caution');
    const iconCancelEl = screen.queryByTestId('control-icon-cancel');

    expect(iconCheckmarkEl.dataset.testSelectingScore).toEqual('true');
    expect(iconCautionEl.dataset.testSelectingScore).toEqual('false');
    expect(iconCancelEl.dataset.testSelectingScore).toEqual('false');
  });

  it('should select second option for score selection when focused for scoring', async () => {
    const props = {
      selected: false,
      canEdit: true,
      selectedToScore: 1,
      showValues: true,
      item: {}
    };

    render(<ThreeActionCheckExclamation {...props} />);

    const iconCheckmarkEl = screen.queryByTestId('control-icon-checkmark');
    const iconCautionEl = screen.queryByTestId('control-icon-caution');
    const iconCancelEl = screen.queryByTestId('control-icon-cancel');

    expect(iconCheckmarkEl.dataset.testSelectingScore).toEqual('false');
    expect(iconCautionEl.dataset.testSelectingScore).toEqual('true');
    expect(iconCancelEl.dataset.testSelectingScore).toEqual('false');
  });

  it('should select third option for score selection when focused for scoring', async () => {
    const props = {
      selected: false,
      canEdit: true,
      selectedToScore: 2,
      showValues: true,
      item: {}
    };

    render(<ThreeActionCheckExclamation {...props} />);

    const iconCheckmarkEl = screen.queryByTestId('control-icon-checkmark');
    const iconCautionEl = screen.queryByTestId('control-icon-caution');
    const iconCancelEl = screen.queryByTestId('control-icon-cancel');

    expect(iconCheckmarkEl.dataset.testSelectingScore).toEqual('false');
    expect(iconCautionEl.dataset.testSelectingScore).toEqual('false');
    expect(iconCancelEl.dataset.testSelectingScore).toEqual('true');
  });

  it('should invoke change action for all selections', () => {
    const expected = 3;
    const onClick = sinon.spy();
    const props = {
      canEdit: true,
      onChange: onClick
    };

    const { container } = render(<ThreeActionCheckExclamation {...props} />);

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

    const { container } = render(<ThreeActionCheckExclamation {...props} />);

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
