import { render, screen } from '@testing-library/react';

import VendorDetailsInput from './index';

describe('Unit | Features | Bid Edit | Form | Vendor Details Input', () => {
  it('should render with blank value', async () => {
    const props = {
      defaultValue: '',
      isLoading: false,
      isBidComplete: false,
      formState: {}
    };

    render(<VendorDetailsInput {...props} />);

    const element = screen.queryByTestId('bid-form-vendor-details');
    expect(element).toBeVisible();
    expect(element).toHaveValue('');
  });

  it('should render with provided vendor details value', async () => {
    const expectedValue = 'John Smith';
    const props = {
      defaultValue: expectedValue,
      isLoading: false,
      isBidComplete: false,
      formState: {}
    };

    render(<VendorDetailsInput {...props} />);

    const element = screen.queryByTestId('bid-form-vendor-details');
    expect(element).toBeVisible();
    expect(element).toHaveValue(expectedValue);
  });
});
