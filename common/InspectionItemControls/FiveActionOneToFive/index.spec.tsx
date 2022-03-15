import sinon from 'sinon';
import { render, act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FiveActionOneToFive, { canAddSelectionStyles } from './index';

describe('Common | Inspection Item Controls | Five Action One to Five', () => {
  afterEach(() => sinon.restore());

  it('should not select any when selected is false', async () => {
    const result = [
      canAddSelectionStyles(false, 0, 0),
      canAddSelectionStyles(false, 0, 1),
      canAddSelectionStyles(false, 0, 2),
      canAddSelectionStyles(false, 0, 3),
      canAddSelectionStyles(false, 0, 4)
    ];

    expect(result).toEqual([false, false, false, false, false]);
  });

  it('should select first option if given 0', async () => {
    const result = [
      canAddSelectionStyles(true, 0, 0),
      canAddSelectionStyles(true, 0, 1),
      canAddSelectionStyles(true, 0, 2),
      canAddSelectionStyles(true, 0, 3),
      canAddSelectionStyles(true, 0, 4)
    ];

    expect(result).toEqual([true, false, false, false, false]);
  });

  it('should select first two option if given 1', async () => {
    const result = [
      canAddSelectionStyles(true, 1, 0),
      canAddSelectionStyles(true, 1, 1),
      canAddSelectionStyles(true, 1, 2),
      canAddSelectionStyles(true, 1, 3),
      canAddSelectionStyles(true, 1, 4)
    ];

    expect(result).toEqual([true, true, false, false, false]);
  });

  it('should select first three option if given 2', async () => {
    const result = [
      canAddSelectionStyles(true, 2, 0),
      canAddSelectionStyles(true, 2, 1),
      canAddSelectionStyles(true, 2, 2),
      canAddSelectionStyles(true, 2, 3),
      canAddSelectionStyles(true, 2, 4)
    ];

    expect(result).toEqual([true, true, true, false, false]);
  });

  it('should select first three option if given 3', async () => {
    const result = [
      canAddSelectionStyles(true, 3, 0),
      canAddSelectionStyles(true, 3, 1),
      canAddSelectionStyles(true, 3, 2),
      canAddSelectionStyles(true, 3, 3),
      canAddSelectionStyles(true, 3, 4)
    ];

    expect(result).toEqual([true, true, true, true, false]);
  });

  it('should select first three option if given 4', async () => {
    const result = [
      canAddSelectionStyles(true, 4, 0),
      canAddSelectionStyles(true, 4, 1),
      canAddSelectionStyles(true, 4, 2),
      canAddSelectionStyles(true, 4, 3),
      canAddSelectionStyles(true, 4, 4)
    ];

    expect(result).toEqual([true, true, true, true, true]);
  });

  it('should select option for selecting score based on given value', async () => {
    const props = {
      selected: false,
      value: 0,
      canEdit: true,
      showValues: true,
      item: {}
    };

    const tests = [
      {
        selectedToScore: 0,
        expected: ['true', 'false', 'false', 'false', 'false'],
        message: 'selects first option'
      },
      {
        selectedToScore: 1,
        expected: ['false', 'true', 'false', 'false', 'false'],
        message: 'selects second option'
      },
      {
        selectedToScore: 2,
        expected: ['false', 'false', 'true', 'false', 'false'],
        message: 'selects third option'
      },
      {
        selectedToScore: 3,
        expected: ['false', 'false', 'false', 'true', 'false'],
        message: 'selects fourth option'
      },
      {
        selectedToScore: 4,
        expected: ['false', 'false', 'false', 'false', 'true'],
        message: 'selects fifth option'
      }
    ];

    const { rerender } = render(<FiveActionOneToFive {...props} />);

    // eslint-disable-next-line no-restricted-syntax
    for (const test of tests) {
      const { selectedToScore, expected } = test;
      const componentProps = { ...props, selectedToScore };
      rerender(<FiveActionOneToFive {...componentProps} />);

      const icon0 = screen.queryByTestId('control-icon-0');
      const icon1 = screen.queryByTestId('control-icon-1');
      const icon2 = screen.queryByTestId('control-icon-2');
      const icon3 = screen.queryByTestId('control-icon-3');
      const icon4 = screen.queryByTestId('control-icon-4');

      expect(icon0.dataset.testSelectingScore).toEqual(expected[0]);
      expect(icon1.dataset.testSelectingScore).toEqual(expected[1]);
      expect(icon2.dataset.testSelectingScore).toEqual(expected[2]);
      expect(icon3.dataset.testSelectingScore).toEqual(expected[3]);
      expect(icon4.dataset.testSelectingScore).toEqual(expected[4]);
    }
  });

  it('should invoke change action for all selections', () => {
    const expected = 5;
    const onClick = sinon.spy();
    const props = {
      canEdit: true,
      onChange: onClick
    };

    const { container } = render(<FiveActionOneToFive {...props} />);

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

    const { container } = render(<FiveActionOneToFive {...props} />);

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
