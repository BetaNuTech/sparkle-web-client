import sinon from 'sinon';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddIcon from '../../public/icons/ios/add.svg';
import MobileHeader from './index';

describe('Unit | Common | Mobile Header', () => {
  afterEach(() => sinon.restore());

  it('title should be visible if present', () => {
    const expected = true;
    render(<MobileHeader title="My Header" />);
    const result = screen.queryByTestId('mobile-header-title');

    const actual = Boolean(result);
    expect(actual).toEqual(expected);
  });

  it('title should be visible if not present', () => {
    const expected = false;
    render(<MobileHeader />);
    const result = screen.queryByTestId('mobile-header-title');

    const actual = Boolean(result);
    expect(actual).toEqual(expected);
  });

  it('does not add a hamburger icon when toggle navigation action is not set', () => {
    const expected = false;
    render(<MobileHeader />);
    const result = screen.queryByTestId('mobile-hamburger');

    const actual = Boolean(result);
    expect(actual).toEqual(expected);
  });

  it('clicking hamburger triggers navigation toggle', () => {
    const expected = true;
    const onClickSpy = sinon.spy();
    const props = {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toggleNavOpen: onClickSpy
    };
    render(<MobileHeader {...props} />);
    const button = screen.queryByTestId('mobile-hamburger');

    if (button) userEvent.click(button);

    const actual = onClickSpy.called;
    expect(actual).toEqual(expected);
  });

  it('renders all action buttons', () => {
    const expected = 2;
    const ActionButtons = () => (
      <>
        <button>
          <AddIcon />
        </button>
        <button>
          <AddIcon />
        </button>
      </>
    );
    const props = {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      actions: ActionButtons
    };
    render(<MobileHeader {...props} />);
    const parentElement = screen.queryByTestId('mobile-actions');

    const actual = parentElement ? parentElement.children.length : 0;
    expect(actual).toEqual(expected);
  });

  it('action buttons respond to their actions', () => {
    const expected = true;
    const onClickSpy = sinon.spy();
    const ActionButtons = () => (
      <>
        <button onClick={onClickSpy}>
          <AddIcon />
        </button>
      </>
    );
    const props = {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      actions: ActionButtons
    };
    render(<MobileHeader {...props} />);
    const actionParent = screen.queryByTestId('mobile-actions');

    const button = actionParent && actionParent.firstElementChild;
    if (button) userEvent.click(button);

    const actual = onClickSpy.called;
    expect(actual).toEqual(expected);
  });
});
