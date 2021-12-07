import { render, screen } from '@testing-library/react';
import moment from 'moment';
import formats from '../../../../../config/formats';
import CompleteDateInput from './index';

describe('Unit | Features | Bid Edit | Form | Complete Date Input', () => {
  it('should render with blank value', async () => {
    const props = {
      defaultValue: '',
      isLoading: false,
      isBidComplete: false,
      isApprovedOrComplete: false,
      formState: {},
      apiErrorCompleteAt: ''
    };

    render(<CompleteDateInput {...props} />);

    const element = screen.queryByTestId('bid-form-complete-at');
    expect(element).toBeVisible();
    expect(element).toHaveValue('');
  });

  it('should render with provided complete at date', async () => {
    const expected = moment().format(formats.browserDateDisplay);
    const props = {
      defaultValue: expected,
      isLoading: false,
      isBidComplete: false,
      formState: {},
      apiErrorCompleteAt: ''
    };

    render(<CompleteDateInput {...props} />);

    const element = screen.queryByTestId('bid-form-complete-at');
    expect(element).toBeVisible();
    expect(element).toHaveValue(expected);
  });

  it('should show api error message if there is an api error for complete date input ', async () => {
    const expectedValue = 'completeAt api error';
    const props = {
      defaultValue: '',
      isLoading: false,
      isBidComplete: false,
      formState: {},
      apiErrorCompleteAt: expectedValue
    };

    render(<CompleteDateInput {...props} />);

    const errorTitle = screen.queryByTestId('error-label-completeAt');

    expect(errorTitle).toBeTruthy();
  });
});
