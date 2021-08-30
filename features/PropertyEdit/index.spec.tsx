import { render, screen } from '@testing-library/react';
import PropertyMobileForm from './MobileForm/index';
import PropertyDesktopForm from './DesktopForm/index';

describe('Unit | Features | Property Edit', () => {
  it('should disable all file form fields when device is offline on mobile view', () => {
    render(<PropertyMobileForm isOnline={false} />);
    const propertyImageField = screen.queryByTestId(
      'property-form-add-image-mobile'
    );
    const logoImageField = screen.queryByTestId(
      'property-form-add-logo-mobile'
    );
    expect(propertyImageField).toHaveAttribute('disabled');
    expect(logoImageField).toHaveAttribute('disabled');
  });

  it('should disable all file form fields when device is offline on desktop view', () => {
    render(<PropertyDesktopForm isOnline={false} />);
    const propertyImageField = screen.queryByTestId('property-form-add-image');
    const logoImageField = screen.queryByTestId('property-form-add-logo');
    expect(propertyImageField).toHaveAttribute('disabled');
    expect(logoImageField).toHaveAttribute('disabled');
  });
});
