import { render, screen } from '@testing-library/react';
import PropertyMobileForm from './MobileForm/index';
import PropertyDesktopForm from './DesktopForm/index';

describe('Unit | Features | Property Edit', () => {
  it('should disable all file form fields when device is offline on mobile view', () => {
    render(
      <PropertyMobileForm
        isOnline={false}
        teams={[]}
        openUpdateTeamModal={() => false}
        openTemplatesEditModal={() => false}
        property={{}}
        selectedTeamId=""
        handleChange={() => false}
        properyImg=""
        logoImg=""
        formState={{ name: '', id: '' }}
        formErrors={{}}
      />
    );
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
    render(
      <PropertyDesktopForm
        isOnline={false}
        teams={[]}
        openUpdateTeamModal={() => false}
        openTemplatesEditModal={() => false}
        property={{}}
        selectedTeamId=""
        onSubmit={() => false}
        handleChange={() => false}
        properyImg=""
        logoImg=""
        removePropertyImage={() => false}
        removeLogo={() => false}
        formState={{ name: '', id: '' }}
        templateNames={[]}
        isLoading={false}
        formErrors={{}}
      />
    );
    const propertyImageField = screen.queryByTestId('property-form-add-image');
    const logoImageField = screen.queryByTestId('property-form-add-logo');
    expect(propertyImageField).toHaveAttribute('disabled');
    expect(logoImageField).toHaveAttribute('disabled');
  });
});
