import sinon from 'sinon';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ThreeActionAbc from './index';

describe('Common | Inspection Item Controls | Three Action Abc', () => {
  afterEach(() => sinon.restore());

  it('should not select any when selected is false', async () => {
    const props = {
      selected: false,
      value: 0,
      canEdit: true
    };

    const { container } = render(<ThreeActionAbc {...props} />);

    const elements = container.querySelectorAll('li');

    elements.forEach((e) => expect(e.dataset.test).toEqual(''));
  });

  it('should select first option if given 0', async () => {
    const props = {
      selected: true,
      value: 0,
      canEdit: true
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
      value: 1,
      canEdit: true
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
      value: 2,
      canEdit: true
    };

    render(<ThreeActionAbc {...props} />);

    const iconAEl = screen.queryByTestId('control-icon-a');
    const iconBEl = screen.queryByTestId('control-icon-b');
    const iconCEl = screen.queryByTestId('control-icon-c');

    expect(iconAEl.dataset.test).toEqual('');
    expect(iconBEl.dataset.test).toEqual('');
    expect(iconCEl.dataset.test).toEqual('selected');
  });

  it('should select first option for score selection when focused for scoring', async () => {
    const props = {
      selected: false,
      selectedToScore: 0,
      canEdit: true,
      showValues: true,
      item: {}
    };

    render(<ThreeActionAbc {...props} />);

    const iconAEl = screen.queryByTestId('control-icon-a');
    const iconBEl = screen.queryByTestId('control-icon-b');
    const iconCEl = screen.queryByTestId('control-icon-c');

    expect(iconAEl.dataset.testSelectingScore).toEqual('true');
    expect(iconBEl.dataset.testSelectingScore).toEqual('false');
    expect(iconCEl.dataset.testSelectingScore).toEqual('false');
  });

  it('should select second option for score selection when focused for scoring', async () => {
    const props = {
      selected: false,
      selectedToScore: 1,
      canEdit: true,
      showValues: true,
      item: {}
    };

    render(<ThreeActionAbc {...props} />);

    const iconAEl = screen.queryByTestId('control-icon-a');
    const iconBEl = screen.queryByTestId('control-icon-b');
    const iconCEl = screen.queryByTestId('control-icon-c');

    expect(iconAEl.dataset.testSelectingScore).toEqual('false');
    expect(iconBEl.dataset.testSelectingScore).toEqual('true');
    expect(iconCEl.dataset.testSelectingScore).toEqual('false');
  });

  it('should select third option for score selection when focused for scoring', async () => {
    const props = {
      selected: false,
      selectedToScore: 2,
      canEdit: true,
      showValues: true,
      item: {}
    };

    render(<ThreeActionAbc {...props} />);

    const iconAEl = screen.queryByTestId('control-icon-a');
    const iconBEl = screen.queryByTestId('control-icon-b');
    const iconCEl = screen.queryByTestId('control-icon-c');

    expect(iconAEl.dataset.testSelectingScore).toEqual('false');
    expect(iconBEl.dataset.testSelectingScore).toEqual('false');
    expect(iconCEl.dataset.testSelectingScore).toEqual('true');
  });

  it('should invoke change action for all selections', () => {
    const expected = 3;
    const onClick = sinon.spy();
    const props = {
      canEdit: true,
      onChange: onClick
    };

    const { container } = render(<ThreeActionAbc {...props} />);

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
      onChange: onClick,
      canEdit: false
    };

    const { container } = render(<ThreeActionAbc {...props} />);

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
