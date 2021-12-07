import { render, screen } from '@testing-library/react';
import moment from 'moment';
import formats from '../../../../../config/formats';
import StartDateInput from './index';

describe('Unit | Features | Bid Edit | Form | Start Date Input', () => {
  it('should render with blank value', async () => {
    const props = {
      defaultValue: '',
      isLoading: false,
      isBidComplete: false,
      isApprovedOrComplete: false,
      formState: {},
      apiErrorStartAt: ''
    };

    render(<StartDateInput {...props} />);

    const element = screen.queryByTestId('bid-form-start-at');
    expect(element).toBeVisible();
    expect(element).toHaveValue('');
  });

  it('should render with provided startAtProcessed value', async () => {
    const expectedValue = moment().format(formats.browserDateDisplay);
    const props = {
      defaultValue: expectedValue,
      isLoading: false,
      isBidComplete: false,
      formState: {},
      apiErrorStartAt: ''
    };

    render(<StartDateInput {...props} />);

    const element = screen.queryByTestId('bid-form-start-at');
    expect(element).toBeVisible();
    expect(element).toHaveValue(expectedValue);
  });

  it('should show api error message if there is an api error for start date input ', async () => {
    const expectedValue = 'startAt api error';
    const props = {
      defaultValue: '',
      isLoading: false,
      isBidComplete: false,
      formState: {},
      apiErrorStartAt: expectedValue
    };

    render(<StartDateInput {...props} />);

    const errorTitle = screen.queryByTestId('error-label-startAt');

    expect(errorTitle).toBeTruthy();
  });
});
