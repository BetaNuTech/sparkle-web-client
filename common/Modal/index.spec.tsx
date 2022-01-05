import sinon from 'sinon';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ModalHOC from './index';

const TestContent = ({ title = 'title' }) => (
  <h1 data-test="modal-test">{title}</h1>
);

describe('Unit | Common | Modal', () => {
  afterEach(() => sinon.restore());

  it('matches prior snapshot', () => {
    const isVisible = true;
    const Modal = ModalHOC(TestContent);
    const { container } = render(<Modal isVisible={isVisible} />);
    expect(container).toMatchSnapshot();
  });

  it('does not render when not visible', () => {
    const expected = false;
    const Modal = ModalHOC(TestContent);
    render(<Modal />);
    const actual = Boolean(screen.queryByTestId('modal'));
    expect(actual).toEqual(expected);
  });

  it('renders when visible', () => {
    const expected = true;
    const isVisible = true;
    const Modal = ModalHOC(TestContent);
    render(<Modal isVisible={isVisible} />);
    const actual = Boolean(screen.queryByTestId('modal'));
    expect(actual).toEqual(expected);
  });

  it('invokes on close action when overlay is clicked', async () => {
    const expected = true;
    const isVisible = true;
    const onClose = sinon.spy();
    const Modal = ModalHOC(TestContent);
    render(<Modal isVisible={isVisible} onClose={onClose} />);
    const overlay = screen.queryByTestId('modal-overlay');

    userEvent.click(overlay);

    // wait for 100 ms as we are triggring onClose after 100ms
    await new Promise((resolve) => setTimeout(resolve, 100));

    const actual = onClose.called;
    expect(actual).toEqual(expected);
  });

  it('renders children inside modal', () => {
    const expected = true;
    const isVisible = true;
    const Modal = ModalHOC(TestContent);
    render(<Modal isVisible={isVisible} />);
    const modal = screen.queryByTestId('modal');
    const actual = Boolean(
      modal ? modal.querySelector('[data-test=modal-test]') : null
    );
    expect(actual).toEqual(expected);
  });

  it('alows configuring child attributes', () => {
    const expected = 'test title';
    const isVisible = true;
    const Modal = ModalHOC(TestContent);
    const { container } = render(
      <Modal isVisible={isVisible} title={expected} />
    );
    const testTitle = container.querySelector('[data-test=modal-test]');
    const actual = `${testTitle ? testTitle.textContent : ''}`.trim();
    expect(actual).toEqual(expected);
  });
});
