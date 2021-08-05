import sinon from 'sinon';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ActionButton from './index';

describe('Unit | Common | Dropdown | Button', () => {
  it('matches prior snapshot', () => {
    const { container } = render(<ActionButton>Delete</ActionButton>);
    expect(container).toMatchSnapshot();
  });

  it('allows dynamic setting text on button', () => {
    const expected = 'Delete';
    const { container } = render(<ActionButton>Delete</ActionButton>);

    const actual = container.querySelector(
      '[data-testid=dropdown-button]'
    ).textContent;

    expect(actual).toEqual(expected);
  });

  it('allows dynamic setting class names on button', () => {
    const expected = true;
    const props = {
      className: 'test-class-name'
    };
    const { container } = render(
      <ActionButton {...props}>Delete</ActionButton>
    );

    const actual = container
      .querySelector('button')
      .classList.contains('test-class-name');

    expect(actual).toEqual(expected);
  });

  it('allows dynamic setting class names on button', () => {
    const expected = true;
    const props = {
      className: 'test-class-name'
    };
    const { container } = render(
      <ActionButton {...props}>Delete</ActionButton>
    );

    const actual = container
      .querySelector('button')
      .classList.contains('test-class-name');

    expect(actual).toEqual(expected);
  });

  it('invokes on click action when button is clicked', () => {
    const expected = true;
    const onClickSpy = sinon.spy();
    const props = {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onClick: onClickSpy
    };
    const { container } = render(
      <ActionButton {...props}>Delete</ActionButton>
    );
    const button = container.querySelector('button');

    userEvent.click(button);

    const actual = onClickSpy.called;
    expect(actual).toEqual(expected);
  });

  it('does not invoke click when button is disabled', () => {
    const expected = false;
    const onClickSpy = sinon.spy();
    const props = {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onClick: onClickSpy,
      disabled: true
    };

    const { container } = render(
      <ActionButton {...props}>Delete</ActionButton>
    );

    const button = container.querySelector('button');

    userEvent.click(button);

    const actual = onClickSpy.called;
    expect(actual).toEqual(expected);
  });
});
