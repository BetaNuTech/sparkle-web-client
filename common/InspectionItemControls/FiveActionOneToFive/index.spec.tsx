import sinon from 'sinon';
import { render, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FiveActionOneToFive, { canAddClass } from './index';

describe('Common | Inspection Item Control | Five Action One to Five', () => {
  afterEach(() => sinon.restore());

  it('should not select any when selected is false', async () => {
    const result = [
      canAddClass(false, 0, 0),
      canAddClass(false, 0, 1),
      canAddClass(false, 0, 2),
      canAddClass(false, 0, 3),
      canAddClass(false, 0, 4)
    ];

    expect(result).toEqual([false, false, false, false, false]);
  });

  it('should select first option if given 0', async () => {
    const result = [
      canAddClass(true, 0, 0),
      canAddClass(true, 0, 1),
      canAddClass(true, 0, 2),
      canAddClass(true, 0, 3),
      canAddClass(true, 0, 4)
    ];

    expect(result).toEqual([true, false, false, false, false]);
  });

  it('should select first two option if given 1', async () => {
    const result = [
      canAddClass(true, 1, 0),
      canAddClass(true, 1, 1),
      canAddClass(true, 1, 2),
      canAddClass(true, 1, 3),
      canAddClass(true, 1, 4)
    ];

    expect(result).toEqual([true, true, false, false, false]);
  });

  it('should select first three option if given 2', async () => {
    const result = [
      canAddClass(true, 2, 0),
      canAddClass(true, 2, 1),
      canAddClass(true, 2, 2),
      canAddClass(true, 2, 3),
      canAddClass(true, 2, 4)
    ];

    expect(result).toEqual([true, true, true, false, false]);
  });

  it('should select first three option if given 3', async () => {
    const result = [
      canAddClass(true, 3, 0),
      canAddClass(true, 3, 1),
      canAddClass(true, 3, 2),
      canAddClass(true, 3, 3),
      canAddClass(true, 3, 4)
    ];

    expect(result).toEqual([true, true, true, true, false]);
  });

  it('should select first three option if given 4', async () => {
    const result = [
      canAddClass(true, 4, 0),
      canAddClass(true, 4, 1),
      canAddClass(true, 4, 2),
      canAddClass(true, 4, 3),
      canAddClass(true, 4, 4)
    ];

    expect(result).toEqual([true, true, true, true, true]);
  });

  it('should invoke click action for all selections when not disabled', () => {
    const expected = 5;
    const onClick = sinon.spy();
    const props = {
      onMainInputChange: onClick
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

  it('should not invoke click action when disabled', () => {
    const expected = false;
    const onClick = sinon.spy();
    const props = {
      onMainInputChange: onClick,
      isDisabled: true
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
