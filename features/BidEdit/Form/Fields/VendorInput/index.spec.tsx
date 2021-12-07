import { render, screen } from '@testing-library/react';

import VendorInput from './index';

describe('Unit | Features | Bid Edit | Form | Vendor Input', () => {
  it('should render with blank value', async () => {
    const props = {
      defaultValue: '',
      isLoading: false,
      isBidComplete: false,
      formState: {},
      apiErrorVendor: ''
    };

    render(<VendorInput {...props} />);

    const element = screen.queryByTestId('bid-form-vendor');
    expect(element).toBeVisible();
    expect(element).toHaveValue('');
  });

  it('should render with provided vendor value', async () => {
    const expectedValue = 'John Smith';
    const props = {
      defaultValue: expectedValue,
      isLoading: false,
      isBidComplete: false,
      formState: {},
      apiErrorVendor: ''
    };

    render(<VendorInput {...props} />);

    const element = screen.queryByTestId('bid-form-vendor');
    expect(element).toBeVisible();
    expect(element).toHaveValue(expectedValue);
  });

  it('should show api error message if there is an api error for vendor input ', async () => {
    const expectedValue = 'Vendor api error';
    const props = {
      defaultValue: '',
      isLoading: false,
      isBidComplete: false,
      formState: {},
      apiErrorVendor: expectedValue
    };

    render(<VendorInput {...props} />);

    const errorTitle = screen.queryByTestId('error-label-vendor');

    expect(errorTitle).toBeTruthy();
  });
});
