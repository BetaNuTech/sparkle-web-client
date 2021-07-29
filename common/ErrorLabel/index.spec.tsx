import sinon from 'sinon';
import { render } from '@testing-library/react';
import ErrorLabel from './index';

const formErrors = {
  firstName: { message: 'First name is required' },
  lastName: { message: 'Last name is required' }
};

describe('Unit | Common | Error Label', () => {
  afterEach(() => sinon.restore());

  it('checks that the label is visible with error message', () => {
    const expected = 'First name is required';
    const { container } = render(
      <ErrorLabel formName="firstName" errors={formErrors} />
    );

    const actual = container.textContent;

    expect(actual).toEqual(expected);
  });

  it('checks that the label is not visible if error not present', () => {
    const { container } = render(
      <ErrorLabel formName="age" errors={formErrors} />
    );

    const errorEl = container.querySelector('[data-testid=error-message-age]');

    expect(errorEl).toBeNull();
  });
});
