import { render, screen } from '@testing-library/react';
import PropertyEdit from './index';

describe('Unit | Features | Property Edit', () => {
  it('should disable all file form fields when device is offline', () => {
    const props = {
      isOnline: false,
      isStaging: true,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toggleNavOpen: () => {}
    };
    render(<PropertyEdit {...props} />);
    const propertyImageField = screen.queryByTestId('property-form-add-image');
    const logoImageField = screen.queryByTestId('property-form-add-logo');
    expect(propertyImageField).toHaveAttribute('disabled');
    expect(logoImageField).toHaveAttribute('disabled');
  });

  it('renders save button in header', () => {
    const props = {
      isOnline: true,
      isStaging: true,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toggleNavOpen: () => {}
    };
    render(<PropertyEdit {...props} />);
    const headerButton = screen.queryByTestId('mobile-header-button');
    expect(headerButton).toBeInTheDocument();
  });
});
