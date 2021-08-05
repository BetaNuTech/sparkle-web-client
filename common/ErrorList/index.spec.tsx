import sinon from 'sinon';
import { render } from '@testing-library/react';
import ErrorList from './index';

const formErrors = ['First name is required', 'Last name is required'];

describe('Unit | Common | Error List', () => {
  afterEach(() => sinon.restore());

  it('check that title is visible and is same as given', () => {
    const expected = 'My custom error';
    const { container } = render(
      <ErrorList title="My custom error" errors={formErrors} />
    );

    const actual = container.querySelector('[data-testid="error-list-title"]').textContent;

    expect(actual).toEqual(expected);
  });

  it('should show all the errors in the list', () => {
    const expected = 2;
    const { container } = render(<ErrorList errors={formErrors} />);

    const actual = container.querySelectorAll('[data-testid="error-list-errortext"]').length;

    expect(actual).toEqual(expected);
  });
});
