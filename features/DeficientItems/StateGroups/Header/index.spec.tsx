import { render, screen } from '@testing-library/react';
import StateItemHeader from './index';

describe('Unit | Features | Deficient Item List | State Item Header', () => {
  it('should render completed state title', () => {
    const expected = 'Completed - Follow Up Required';
    render(
      <StateItemHeader
        state="completed"
        itemCount={1} />
    );

    const title = screen.queryByTestId('state-item-title');
    expect(title).toHaveTextContent(expected);
  });

  it('should render incomplete state title', () => {
    const expected = 'Incomplete - Follow Up Required';
    render(
      <StateItemHeader
        state="incomplete"
        itemCount={1} />
    );

    const title = screen.queryByTestId('state-item-title');
    expect(title).toHaveTextContent(expected);
  });

  it('should render overdue state title', () => {
    const expected = 'Past Due Date - Action Required';
    render(
      <StateItemHeader
        state="overdue"
        itemCount={1} />
    );

    const title = screen.queryByTestId('state-item-title');
    expect(title).toHaveTextContent(expected);
  });

  it('should render requires-action state title', () => {
    const expected = 'NEW - Action Required';
    render(
      <StateItemHeader
        state="requires-action"
        itemCount={1} />
    );

    const title = screen.queryByTestId('state-item-title');
    expect(title).toHaveTextContent(expected);
  });

  it('should render go-back state title', () => {
    const expected = 'Go Back - Action Required';
    render(
      <StateItemHeader
        state="go-back"
        itemCount={1} />
    );

    const title = screen.queryByTestId('state-item-title');
    expect(title).toHaveTextContent(expected);
  });

  it('should render requires-progress-update state title', () => {
    const expected = 'Pending - Action Required';
    render(
      <StateItemHeader
        state="requires-progress-update"
        itemCount={1} />
    );

    const title = screen.queryByTestId('state-item-title');
    expect(title).toHaveTextContent(expected);
  });

  it('should render deferred state title', () => {
    const expected = 'Deferred';
    render(
      <StateItemHeader
        state="deferred"
        itemCount={1} />
    );

    const title = screen.queryByTestId('state-item-title');
    expect(title).toHaveTextContent(expected);
  });

  it('should render pending state title', () => {
    const expected = 'Pending';
    render(
      <StateItemHeader
        state="pending"
        itemCount={1} />
    );

    const title = screen.queryByTestId('state-item-title');
    expect(title).toHaveTextContent(expected);
  });

  it('should render closed state title', () => {
    const expected = 'Closed';
    render(
      <StateItemHeader
        state="closed"
        itemCount={1} />
    );

    const title = screen.queryByTestId('state-item-title');
    expect(title).toHaveTextContent(expected);
  });

  it('should render overdue state title with plural', () => {
    const expected = 'Past Due Date - Actions Required';
    render(
      <StateItemHeader
        state="overdue"
        itemCount={2} />
    );

    const title = screen.queryByTestId('state-item-title');
    expect(title).toHaveTextContent(expected);
  });

  it('should render requires-action state title with plural', () => {
    const expected = 'NEW - Actions Required';
    render(
      <StateItemHeader
        state="requires-action"
        itemCount={2} />
    );

    const title = screen.queryByTestId('state-item-title');
    expect(title).toHaveTextContent(expected);
  });

  it('should render go-back state title with plural', () => {
    const expected = 'Go Back - Actions Required';
    render(
      <StateItemHeader
        state="go-back"
        itemCount={2} />
    );

    const title = screen.queryByTestId('state-item-title');
    expect(title).toHaveTextContent(expected);
  });

  it('should render requires-progress-update state title with plural', () => {
    const expected = 'Pending - Actions Required';
    render(
      <StateItemHeader
        state="requires-progress-update"
        itemCount={2} />
    );

    const title = screen.queryByTestId('state-item-title');
    expect(title).toHaveTextContent(expected);
  });

  it('should render selected count', () => {
    const expected = 3;
    render(
      <StateItemHeader
        state="requires-progress-update"
        itemCount={2}
        selectedCount={expected}
      />
    );

    const selectedCountEl = screen.queryByTestId('selected-items-count');
    expect(selectedCountEl).toBeVisible();
    expect(selectedCountEl).toHaveTextContent(expected.toString());
  });
});
